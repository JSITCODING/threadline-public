import { readFileSync } from "node:fs";
import { join } from "node:path";
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { normalizeChatGptExport } from "./chatgpt.js";

const fixture = join(process.cwd(), "examples", "fixtures", "conversations.json");

function syntheticExportWithParts(parts: unknown[]): unknown {
  return [{
    id: "synthetic-attachment-conversation",
    title: "Synthetic attachment handling",
    current_node: "node-1",
    mapping: {
      "node-1": {
        id: "node-1",
        parent: null,
        message: {
          id: "message-1",
          author: { role: "user" },
          content: { parts }
        }
      }
    }
  }];
}

describe("ChatGPT normalization", () => {
  it("normalizes the active branch and preserves Portuguese and English text", () => {
    const conversations = normalizeChatGptExport(JSON.parse(readFileSync(fixture, "utf8")) as unknown);
    assert.equal(conversations.length, 3);
    assert.equal(conversations[0]?.messages.length, 2);
    assert.equal(conversations[0]?.messages.some((message) => message.content.includes("abandoned")), false);
    assert.equal(conversations[0]?.messages[0]?.content, "Quero transformar conversas úteis em propostas de memória revisáveis.");
    assert.equal(conversations[0]?.messages[1]?.content, "Start with import, normalization, explicit approval, and rollback.");
    assert.equal(conversations[1]?.sensitive, true);
    assert.equal(conversations[2]?.messages[0]?.attachments[0]?.name, "example.png");
  });

  it("keeps a missing synthetic attachment reference without resolving the file", () => {
    const conversations = normalizeChatGptExport(syntheticExportWithParts([
      "Review a referenced file that is intentionally absent.",
      {
        asset_pointer: "file-service://synthetic-missing-file",
        name: "missing-example.bin",
        mime_type: "application/octet-stream"
      }
    ]));

    assert.deepEqual(conversations[0]?.messages[0]?.attachments, [{
      name: "missing-example.bin",
      assetPointer: "file-service://synthetic-missing-file",
      mimeType: "application/octet-stream"
    }]);
  });

  it("ignores an unsupported synthetic attachment shape without crashing", () => {
    const conversations = normalizeChatGptExport(syntheticExportWithParts([
      "Keep the message while ignoring unknown attachment metadata.",
      {
        unsupported_attachment: {
          kind: "future-synthetic-kind",
          reference: 42
        }
      }
    ]));

    assert.equal(conversations[0]?.messages[0]?.content, "Keep the message while ignoring unknown attachment metadata.");
    assert.deepEqual(conversations[0]?.messages[0]?.attachments, []);
  });

  it("rejects malformed exports", () => {
    assert.throws(() => normalizeChatGptExport({ conversations: [] }));
  });
});
