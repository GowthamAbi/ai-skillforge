// Hand-authored, deterministic practice checks. No paid AI/API or generated transcript claims.
const q = (question, options, answer, explanation) => ({ question, options, answer, explanation });
const BANKS = {
  python: [
    q('What does a Python list comprehension create?', ['A new list from an iterable', 'A database index', 'A Docker image', 'A package lockfile'], 0, 'A comprehension constructs a list by transforming or filtering an iterable.'),
    q('Which tool helps isolate Python package dependencies for a project?', ['CSS modules', 'A virtual environment', 'Git branches alone', 'SQL views'], 1, 'A virtual environment keeps dependencies scoped to a project.'),
    q('What does a Python dictionary primarily store?', ['Ordered pixels', 'Only floating-point numbers', 'Key-value pairs', 'Compiled bytecode only'], 2, 'Dictionary keys map to values for efficient lookup.'),
    q('What should you do when a Python function fails a test?', ['Disable every test', 'Ignore the traceback', 'Commit the exception', 'Reproduce, debug and add a regression test'], 3, 'Reproducing failures and testing fixes prevents regressions.'),
    q('What does `with open(path) as file` help manage?', ['Closing the file resource automatically', 'GPU memory optimization', 'SQL transactions exclusively', 'Browser session cookies'], 0, 'Context managers clean up files even if an error occurs.')
  ],
  sql: [
    q('What does SQL JOIN primarily do?', ['Resize a database', 'Combine rows from related tables', 'Train an LLM', 'Encrypt frontend CSS'], 1, 'JOIN combines records based on matching related columns.'),
    q('Which clause groups rows before aggregate calculations?', ['ORDER BY', 'LIMIT', 'GROUP BY', 'DROP'], 2, 'GROUP BY enables aggregates per group.'),
    q('How should app code safely include user values in SQL?', ['String concatenation', 'Raw interpolated queries', 'Removing error messages', 'Parameterized queries'], 3, 'Parameters protect query values from SQL injection.'),
    q('What is a primary key used for?', ['Uniquely identifying a row', 'Styling a form', 'Sorting JavaScript imports', 'Running CI'], 0, 'A primary key uniquely identifies a record.'),
    q('What should you check before optimizing a slow SQL query?', ['Browser theme', 'Query plan and indexes', 'Udemy playback speed', 'CSS selector names'], 1, 'EXPLAIN/query plans help identify scans and opportunities for indexes.')
  ],
  fullstack: [
    q('What should a REST API return when creating a resource successfully?', ['Only HTML comments', 'Always a 404', 'A success status such as 201 and useful data', 'An exposed secret'], 2, 'HTTP 201 indicates successful resource creation.'),
    q('Where should production API keys live?', ['Public JavaScript variables', 'README screenshots', 'Browser localStorage for every visitor', 'Protected server-side configuration'], 3, 'Secrets must remain outside public frontend bundles.'),
    q('Why validate request bodies on the server?', ['Clients can be modified or bypassed', 'To remove all frontend checks', 'To skip integration tests', 'To make every request public'], 0, 'Client-side validation alone cannot enforce server trust boundaries.'),
    q('How do automated integration tests help a full-stack project?', ['They guarantee perfect UI design', 'They check components working across boundaries', 'They replace production monitoring', 'They eliminate database migrations'], 1, 'Integration tests exercise multiple layers together.'),
    q('What is a good practice when deploying a React frontend and API?', ['Hard-code every secret in React', 'Disable HTTPS', 'Configure safe API origins and environment-specific URLs', 'Ignore network errors'], 2, 'Deployment requires correct public URLs, CORS and secret handling.')
  ],
  rag: [
    q('What is the main role of retrieval in RAG?', ['Retrieve relevant external context', 'Train the model from scratch', 'Replace the tokenizer', 'Compress CSS files'], 0, 'RAG supplies relevant retrieved context at answer time.'),
    q('Which choice most directly improves RAG source traceability?', ['Longer system prompts', 'Showing document/source citations', 'Removing chunk metadata', 'Increasing randomness'], 1, 'Source metadata makes retrieved evidence traceable.'),
    q('Why is chunking used in document retrieval?', ['To make all text lowercase', 'To avoid storing metadata', 'To create manageable searchable passages', 'To hide irrelevant documents'], 2, 'Chunking creates useful units for indexing and retrieval.'),
    q('How should a RAG assistant respond if no relevant evidence is found?', ['Invent an answer', 'Quote unrelated sources', 'Ignore confidence', 'Say evidence is insufficient'], 3, 'A grounded assistant should acknowledge missing evidence.'),
    q('What does reranking typically do?', ['Reorders retrieved candidates for relevance', 'Changes the user password', 'Deletes embeddings', 'Deploys the front end'], 0, 'A reranker scores candidates after initial retrieval.')
  ],
  agent: [
    q('Which component lets an AI agent act on external systems?', ['A CSS variable', 'A tool with a defined interface', 'A larger font', 'Only a longer answer'], 1, 'Agents use tool calls to interact with systems.'),
    q('What makes a tool-calling agent loop different from a single chat response?', ['No prompts exist', 'The model is always local', 'It can observe tool results and choose a next action', 'It cannot stop'], 2, 'A loop includes action, observation and further decisions.'),
    q('What is a safe pattern for sensitive agent actions?', ['Automatically approve all actions', 'Hide execution logs', 'Ignore authentication', 'Require human approval'], 3, 'Human approval is important for risky actions.'),
    q('What must be returned to a model after a function/tool call?', ['A matched tool result and call identifier', 'A screenshot only', 'New training weights', 'A CSS stylesheet'], 0, 'Tool results should be matched to the call that requested them.'),
    q('Why is observability valuable for AI agents?', ['It removes all hallucinations', 'It helps trace steps, tool calls and failures', 'It makes network costs zero', 'It guarantees accuracy'], 1, 'Execution traces help debugging and evaluation.')
  ],
  deployment: [
    q('Why should API secrets be stored in server environment variables?', ['For prettier code', 'To speed up CSS', 'To keep credentials out of client bundles', 'To make logs public'], 2, 'Client bundles are readable; secrets belong server-side.'),
    q('What does a CI pipeline commonly verify before deployment?', ['Personal browsing history', 'Only font colors', 'GitHub profile pictures', 'Builds and automated tests'], 3, 'CI validates source before release.'),
    q('Which endpoint is useful for deployment health monitoring?', ['A lightweight /health endpoint', 'A password reset page', 'A large video upload', 'An HTML comment'], 0, 'A health endpoint helps track service availability.'),
    q('What is the main purpose of containerization?', ['Replace testing', 'Package app and dependencies consistently', 'Remove security needs', 'Increase random sampling'], 1, 'Containers standardize runtime environments.'),
    q('What should production logging avoid?', ['Error categories', 'Request IDs', 'Raw API keys and credentials', 'Response latency'], 2, 'Secrets should never be written to logs.')
  ],
  model: [
    q('What does a tokenizer do?', ['Deploy servers', 'Measure GPU temperature', 'Draw diagrams', 'Map text into model tokens'], 3, 'Tokenizers transform text into tokens/IDs for models.'),
    q('What is an inference call?', ['Using an existing model to produce an output', 'Training a foundation model from scratch', 'Deleting model weights', 'Updating dependencies'], 0, 'Inference runs a model on inputs.'),
    q('How does temperature often affect LLM output?', ['It chooses the database', 'It affects sampling randomness', 'It increases token limit automatically', 'It changes training data'], 1, 'Temperature changes the model sampling distribution.'),
    q('Why might quantization be useful?', ['It adds new labels', 'It guarantees better accuracy', 'It reduces model memory usage', 'It avoids evaluation'], 2, 'Lower-precision representations reduce memory and compute needs.'),
    q('What is a system prompt typically used for?', ['Storing passwords', 'Selecting a Git branch', 'Measuring latency', 'Specifying assistant-level behavior'], 3, 'System messages guide the assistant behavior and role.')
  ],
  embedding: [
    q('What is a text embedding?', ['A numerical representation of meaning/features', 'An encrypted API key', 'A Git commit', 'A package manager'], 0, 'Embeddings map text into vector space.'),
    q('What does cosine similarity compare?', ['Two HTTP headers', 'The angle between vectors', 'File extensions', 'Cloud provider prices'], 1, 'Cosine similarity uses vector direction.'),
    q('Why are embeddings useful for semantic search?', ['They replace permissions', 'They auto-generate credentials', 'They match related meanings beyond exact words', 'They avoid data indexing'], 2, 'Semantically related text can have nearby embeddings.'),
    q('What should be stored with embedded chunks?', ['Only the current date', 'Raw passwords', 'Nothing', 'Source identifiers and metadata'], 3, 'Metadata is needed for source attribution and filtering.'),
    q('What is a common reason retrieval fails?', ['Poor chunks or mismatched embeddings', 'Using semantic queries', 'Providing source citations', 'Adding evaluation tests'], 0, 'Indexing and chunk quality strongly affect retrieval.')
  ],
  training: [
    q('What should be separated to fairly evaluate an ML model?', ['Prompt and CSS', 'Training and test data', 'CPU and mouse', 'Git and README'], 1, 'Held-out tests assess generalization.'),
    q('What is overfitting?', ['Too few logs', 'Low network latency', 'Memorizing train patterns with poor generalization', 'Deploying early'], 2, 'Overfit models perform better on seen examples than unseen ones.'),
    q('What does LoRA usually train?', ['All tokenizer vocabulary', 'Only frontend code', 'The retrieval index', 'Small low-rank adapter weights'], 3, 'LoRA adapts a model with small trainable matrices.'),
    q('How can training data leakage affect scores?', ['It creates misleadingly optimistic evaluation', 'It improves production security', 'It reduces model size', 'It enforces user permissions'], 0, 'Leakage compromises fair measurement.'),
    q('Why record a baseline before fine-tuning?', ['To hide errors', 'To know if fine-tuning improved outcomes', 'To avoid deployment', 'To skip data cleaning'], 1, 'Baselines make improvements measurable.')
  ],
  evaluation: [
    q('What makes an AI evaluation reproducible?', ['Changing prompts each run', 'Ignoring failures', 'A fixed test dataset and clear metrics', 'Only relying on a demo'], 2, 'Fixed cases and criteria support consistent comparisons.'),
    q('Why test prompt injection?', ['To increase token count', 'To improve colors', 'To shorten URLs', 'To check untrusted text cannot override instructions'], 3, 'Untrusted content can attempt to redirect agent behavior.'),
    q('What is a useful way to assess RAG faithfulness?', ['Compare answers with retrieved evidence', 'Count browser tabs', 'Measure CSS size', 'Inspect folder names'], 0, 'Faithfulness checks grounding in evidence.'),
    q('Why track error rate and latency?', ['To substitute model training', 'To monitor real production quality', 'To bypass auth', 'To avoid tests'], 1, 'Reliability and speed matter in actual use.'),
    q('What should happen when an evaluation case fails?', ['Delete the testcase', 'Mark it passed', 'Investigate and add a regression check', 'Hide the output'], 2, 'Failures should inform improvements and tests.')
  ],
  basic: [
    q('What should you do after watching a technical coding lecture?', ['Only memorize its title', 'Copy code without running', 'Ignore examples', 'Implement and test a small example'], 3, 'Writing and testing code builds practical understanding.'),
    q('What helps explain a project to employers?', ['A README with problem, setup and results', 'Only a screenshot', 'No repository', 'Uncommitted code'], 0, 'A useful README communicates design and outcomes.'),
    q('Why use version control while learning?', ['To replace tests', 'To track changes and project history', 'To hide errors', 'To generate API credits'], 1, 'Version history supports iteration and collaboration.'),
    q('What should be done when tutorial code breaks?', ['Skip the topic', 'Hard-code output', 'Read the error and isolate the cause', 'Publish credentials'], 2, 'Systematic debugging is a core engineering skill.'),
    q('What shows real mastery of a lesson?', ['Watching at 2x speed', 'Copying the slide', 'Skipping practice', 'Building something that applies the concept'], 3, 'Transfer to working projects shows understanding.')
  ]
};

export function topicCategory(lesson) {
  const chosen = { python: 'python', sql: 'sql', ml: 'training', llm: 'model', rag: 'rag', agents: 'agent', deployment: 'deployment', evaluation: 'evaluation', fullstack: 'fullstack', general: 'basic' }[lesson?.category];
  if (chosen) return chosen;
  const text = String(lesson?.title || '').toLowerCase();
  if (/\bsql\b|postgres|mysql|database query|\bjoins?\b/.test(text)) return 'sql';
  if (/\bpython\b|pandas|numpy|fastapi|pytest/.test(text)) return 'python';
  if (/rag|retriev|vector store|chunk|rerank|knowledge base/.test(text)) return 'rag';
  if (/agent|langgraph|crewai|tool call|mcp|autogen|pydanticai|strands|multi-agent|workflow/.test(text)) return 'agent';
  if (/deploy|docker|cloud|aws|bedrock|lambda|azure|terraform|vercel|ci\/cd|monitor|production|kubernetes|security|authentication/.test(text)) return 'deployment';
  if (/embed|semantic|cosine|vector|similarity/.test(text)) return 'embedding';
  if (/train|fine.tun|qlora|lora|dataset|gradient|pytorch|regression|neural network/.test(text)) return 'training';
  if (/evaluat|benchmark|test set|guardrail|prompt injection|observab|metrics/.test(text)) return 'evaluation';
  if (/llm|model|token|inference|prompt|openai|ollama|hugging face|quantiz|transformer|gemini|claude|gpt/.test(text)) return 'model';
  return 'basic';
}

export function lessonQuiz(lesson) {
  const category = topicCategory(lesson);
  return BANKS[category].map(({ question, options, answer, explanation }, index) => ({
    id: `${lesson.id}-q${index + 1}`, question, options, answer, explanation
  }));
}
