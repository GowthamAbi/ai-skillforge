const PRACTICAL_CONTEXT = {
  python: 'Use production quantities, machine downtime, rejection counts, shift names, and delivery targets as realistic inputs.',
  math: 'Use small production datasets to calculate averages, variation, probabilities, vectors, and relationships.',
  data: 'Use a production CSV containing date, shift, machine, target, actual output, rejects, and downtime.',
  mlfund: 'Frame the problem using historical machine, shift, production, and maintenance records.',
  supervised: 'Use labelled historical records to predict a numeric outcome or a known category.',
  unsupervised: 'Explore patterns and groups in production records when labels are not available.',
  mleval: 'Compare model predictions with observed production outcomes and quantify errors.',
  nn: 'Trace inputs through weights, activation, predictions, loss, and parameter updates.',
  frameworks: 'Build a small reproducible tensor or model experiment and inspect shapes and outputs.',
  architectures: 'Use image, audio, or sequence examples to understand how the architecture processes data.',
  text: 'Use short production notes, customer feedback, and delivery messages as sample text.',
  nlptasks: 'Use realistic customer messages and production notes to test language-processing behavior.',
  modernnlp: 'Compare model input, attention/context handling, generated output, and evaluation.',
  genfund: 'Compare model responses while changing input, context, token limits, and generation settings.',
  prompt: 'Improve a real task prompt by specifying role, context, constraints, examples, and output format.',
  apis: 'Call a model endpoint from a backend service and inspect authentication, response, errors, latency, and usage.',
  rag: 'Use a syllabus or production procedure document as the source for retrieval and grounded answers.',
  finetune: 'Prepare a small, quality-checked dataset and compare adaptation approaches using an evaluation set.',
  agents: 'Design a bounded assistant that selects tools, tracks state, and requests approval for consequential actions.',
  software: 'Implement the concept in a maintainable API or application module with validation and tests.',
  architecture: 'Trace data from the user interface through backend services, model components, and storage.',
  quality: 'Build a representative test set and check correctness, safety, reliability, and regression behavior.',
  deploy: 'Apply the concept in a deployed service and verify health, logs, configuration, and recovery.',
  advancedeng: 'Measure quality, latency, cost, and reliability under realistic workloads.',
  research: 'Read a paper or technical source and record its problem, method, evidence, limitations, and reproducibility.',
  capstone: 'Connect the concept to the AI Speaking Coach workflow: conversation, transcription, correction, feedback, history, and revision.'
};

const PYTHON_EXAMPLE = `# A small experiment: inputs -> processing -> result
planned_quantity = 500
actual_quantity = 438
rejected_quantity = 12

good_quantity = actual_quantity - rejected_quantity
shortfall = planned_quantity - actual_quantity
achievement_percent = actual_quantity / planned_quantity * 100

print("Good quantity:", good_quantity)
print("Shortfall:", shortfall)
print("Achievement:", round(achievement_percent, 2), "%")`;

const BASE_QUIZ = [
  { question: 'What is the first step when learning a new technical concept?', options: ['Memorize code without context', 'Identify the problem, inputs, process, and expected output', 'Skip examples and begin deployment', 'Assume the first result is always correct'], answer: 1, explanation: 'Understanding the problem, inputs, process, and expected output gives the concept a clear purpose.' },
  { question: 'How should you validate a practical implementation?', options: ['Run only one ideal example', 'Check expected output and test normal, boundary, and invalid cases', 'Avoid checking errors', 'Copy an answer without running it'], answer: 1, explanation: 'Testing normal, boundary, and invalid cases helps expose incorrect assumptions and edge cases.' },
  { question: 'What should you do when an experiment produces an unexpected result?', options: ['Ignore it', 'Record the result, inspect assumptions and inputs, then debug systematically', 'Delete the project', 'Change several things without tracking them'], answer: 1, explanation: 'A recorded, systematic investigation makes errors reproducible and easier to fix.' },
  { question: 'Which practice improves maintainability?', options: ['Unclear names and duplicated code', 'No documentation or tests', 'Small understandable components with useful names and checks', 'Hard-coded secrets'], answer: 2, explanation: 'Readable structure, meaningful names, and checks make software easier to maintain.' },
  { question: 'What should a useful revision note contain?', options: ['Only the topic title', 'The key idea, a worked example, a mistake, and its correction', 'Unrelated copied text', 'Only the final answer'], answer: 1, explanation: 'A concise explanation, example, mistake, and correction make revision actionable.' }
];

export function buildCompleteLesson(topic) {
  const context = PRACTICAL_CONTEXT[topic.groupId] || 'Apply the concept to a small, measurable real-world problem and verify the result.';
  const title = topic.title;
  const isPython = topic.phaseId === 'p1' && topic.groupId === 'python';
  const code = isPython ? PYTHON_EXAMPLE : `# Study experiment for: ${title}
# 1. Write down the problem and expected result.
# 2. Replace the sample values with a small real dataset.
# 3. Run one experiment and inspect the result.

sample_input = [10, 20, 30]
result = sum(sample_input) / len(sample_input)
print("Input:", sample_input)
print("Calculated result:", result)

# Extend this experiment with the specific tool or library
# introduced in the lesson, then test an edge case.`;
  const output = isPython
    ? 'Good quantity: 426\\nShortfall: 62\\nAchievement: 87.6 %'
    : 'Input: [10, 20, 30]\\nCalculated result: 20.0';
  return {
    title,
    outcomes: [
      `Explain the purpose and core terminology of ${title}.`,
      `Describe the main workflow and the role of each important component in ${title}.`,
      'Work through a small example and interpret its result.',
      'Identify common mistakes, limitations, and validation checks.',
      'Apply the concept to a realistic production or AI-engineering scenario.'
    ],
    theory: [
      { heading: '1. Concept and purpose', body: `${title} is a technical topic in ${topic.groupTitle} (${topic.phaseTitle}). Begin by identifying the problem it solves, the inputs it requires, the transformation or reasoning it performs, and the output it produces. Be clear about the assumptions and the situations where this approach is appropriate. A definition alone is not enough: connect the idea to a concrete problem and explain why the chosen method is useful.`, example: `For ${title}, describe one problem, list its inputs, explain the processing steps, and state what a correct output should look like.` },
      { heading: '2. Main components and workflow', body: `Break ${title} into smaller components. For each component, record its responsibility, required inputs, produced outputs, and dependencies. Follow the flow in order rather than treating the topic as a list of disconnected terms. Check data types, units, assumptions, configuration, and error conditions at each boundary. This makes the concept easier to implement and debug.`, example: 'Draw a four-part flow: input → preparation → core operation → output and validation. Add the actual components from this topic to each step.' },
      { heading: '3. Worked example and interpretation', body: `Start with a small example for ${title} so that every value and operation can be checked manually. Predict the result before running the example. Execute it, compare actual and expected results, and explain any difference. Then change one input at a time to observe how the result changes. This experiment-based method helps distinguish a real understanding from memorized steps.`, example: context },
      { heading: '4. Practical implementation', body: `A practical implementation of ${title} should have a clearly defined objective, representative input data, a repeatable process, and a measurable result. Keep the first version small. Separate preparation, core logic, and evaluation where appropriate. Record tool or library versions and important settings so the experiment can be repeated. Do not use production data containing personal or confidential information in an unsecured experiment.`, example: context },
      { heading: '5. Common mistakes and validation', body: `Common learning and implementation errors include unclear problem definitions, incorrect assumptions, unsuitable input data, skipped validation, and interpreting an output without checking how it was produced. Test at least one normal case, one boundary case, and one invalid or unexpected case. Record the failure, find its cause, make one controlled correction, and rerun the same test.`, example: 'Keep a small test table with input, expected output, actual output, pass/fail, and notes. This becomes a useful mistake notebook.' },
      { heading: '6. Review and professional use', body: `To retain ${title}, explain it without looking at the notes, reproduce the example, and describe one limitation. In a team project, document the decision, dependencies, assumptions, and verification steps. For a production-facing solution, also consider reliability, security, privacy, maintainability, and cost where relevant.`, example: 'Write a five-line summary: problem, key idea, workflow, practical result, and one limitation.' }
    ],
    flow: ['Define the problem', 'Prepare and inspect inputs', 'Apply the core concept', 'Validate and interpret output'],
    code,
    codeExplanation: [
      ['sample_input = [10, 20, 30]', 'Create a small, controlled input so the example can be repeated. Replace it with topic-appropriate data when practicing the specific tool.'],
      ['result = sum(sample_input) / len(sample_input)', 'Apply a simple calculation to demonstrate the input-processing-output pattern. The detailed implementation for this topic should replace this baseline experiment.'],
      ['print("Input:", sample_input)', 'Display the input so that the experiment can be inspected.'],
      ['print("Calculated result:", result)', 'Display the computed result and compare it with your prediction.']
    ],
    output,
    practical: context,
    tasks: [
      { level: 'Easy', prompt: `In your own words, define ${title}. List its purpose, two important terms, one input, and one expected output. Add a small example.`, hint: 'Use the structure: problem → input → process → output. Keep the example small enough to verify manually.' },
      { level: 'Medium', prompt: `Create a working mini-example for ${title}. Show the input, the main processing steps, the output, and explain why the output is correct. Test one boundary or invalid case.`, hint: 'Change one input at a time. Record expected and actual outputs and explain any mismatch.' },
      { level: 'Practical', prompt: `Apply ${title} to this scenario: analyze a shift with target 500 pieces, actual output 438, rejected quantity 12, and downtime 45 minutes. Identify which parts of this lesson help solve the problem, implement a small experiment, and explain its limitations.`, hint: 'Separate the business question from the technical method. State assumptions and units, then validate calculations with a hand-worked result.' }
    ],
    quiz: BASE_QUIZ.map(q => ({ ...q, question: q.question.replace('a new technical concept', `the topic ${title}`) }))
  };
}

