import { useState } from "react";

function DocumentContent({ content }: { content: string }) {
  const [expanded, setExpanded] = useState(false);

  const shouldTruncate = content.length > 100;
  const displayText = expanded || !shouldTruncate
    ? content
    : content.slice(0, 100) + "…";

  return (
    <div>
      <span className="text-gray-600 mb-2 whitespace-pre-wrap">
        {displayText}
      </span>

      {shouldTruncate && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-500 hover:underline text-sm"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}

export default DocumentContent;
