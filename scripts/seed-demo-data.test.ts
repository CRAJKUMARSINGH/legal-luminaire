import assert from "node:assert/strict";
import { once } from "node:events";
import { createServer } from "node:http";
import { test } from "node:test";
import { seedDemo } from "./seed-demo-data";

test("uploads the fixed synthetic file, checks indexing, and rejects non-local destinations", async () => {
  const caseId = "synthetic-construction-demo";
  const requests: Array<{ path?: string; method?: string; type?: string; key?: string | string[]; body: string }> = [];
  let uploadErrors: string[] = [];
  const server = createServer(async (request, response) => {
    const chunks: Buffer[] = [];
    for await (const chunk of request) chunks.push(chunk);
    requests.push({
      path: request.url, method: request.method, type: request.headers["content-type"],
      key: request.headers["x-api-key"], body: Buffer.concat(chunks).toString("utf8"),
    });
    response.setHeader("content-type", "application/json");
    response.end(JSON.stringify({ success: true, case_id: caseId, total_chunks: 3, errors: uploadErrors }));
  });

  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  try {
    const address = server.address();
    assert.ok(address && typeof address === "object");
    const url = `http://127.0.0.1:${address.port}`;
    assert.equal(await seedDemo(url, "test-key"), 3);

    const [upload] = requests;
    assert.equal(upload.method, "POST");
    assert.equal(upload.path, `/api/v1/cases/${caseId}/upload`);
    assert.equal(upload.key, "test-key");
    assert.match(upload.type ?? "", /^multipart\/form-data; boundary=/);
    assert.match(upload.body, /name="files"; filename="construction-defect-report\.md"/);
    assert.match(upload.body, /\[SYNTHETIC TEST DATA — NOT REAL\]/);

    uploadErrors = ["Synthetic indexing error"];
    await assert.rejects(seedDemo(url), /did not confirm successful indexing/);
    await assert.rejects(seedDemo("https://example.com"), /local HTTP or HTTPS/);
    assert.equal(requests.length, 2);
  } finally {
    const closed = once(server, "close");
    server.close();
    await closed;
  }
});
