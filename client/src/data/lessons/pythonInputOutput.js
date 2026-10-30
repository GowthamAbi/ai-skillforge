export const PYTHON_INPUT_OUTPUT_LESSON = {
  title: 'Input, output, operators, expressions',
  outcomes: [
    'Read user input with input() and convert it to the correct type.',
    'Display readable results with print(), separators, and f-strings.',
    'Use arithmetic, comparison, logical, assignment, and membership operators.',
    'Build and evaluate expressions using Python operator precedence.',
    'Validate inputs and handle common conversion mistakes.'
  ],
  theory: [
    { heading: '1. Output with print()', body: 'The print() function sends information to the output area. It can display text, numbers, variables, and multiple values. Separate multiple values with commas; by default Python inserts a space between them. The sep argument changes that separator, and end changes what is printed after the values. Use f-strings for readable messages that include variable values.', example: 'target = 500; actual = 438; print("Target:", target, "Actual:", actual) displays Target: 500 Actual: 438. An f-string such as print(f"Achievement: {actual / target:.1f}%") formats the calculated value.' },
    { heading: '2. Read input with input()', body: 'input(prompt) displays a prompt and waits for the user to type a value. It always returns a string, even when the user types digits. Convert numeric text before arithmetic: int() for whole numbers and float() for decimal numbers. Invalid text raises ValueError, so real applications should validate or catch conversion errors instead of assuming every input is correct.', example: 'actual_text = input("Enter actual quantity: "); actual = int(actual_text). If the user enters 438, actual is an integer. If they enter four hundred, int() raises ValueError.' },
    { heading: '3. Arithmetic operators', body: 'Python arithmetic operators include + (addition), - (subtraction), * (multiplication), / (true division), // (floor division), % (remainder), and ** (power). Division with / returns a float. Floor division rounds down to the next lower integer, which matters for negative numbers. The remainder operator is useful for checking divisibility or leftover pieces.', example: 'If 438 pieces are packed into boxes of 50, 438 // 50 is 8 complete boxes and 438 % 50 is 38 remaining pieces.' },
    { heading: '4. Comparison and logical operators', body: 'Comparison operators ==, !=, >, <, >=, and <= compare values and return True or False. Logical operators and, or, and not combine or reverse Boolean conditions. Use == to compare values; a single = assigns a value. Parentheses make multi-part conditions easier to read and reduce mistakes.', example: 'is_below_target = actual < target; has_high_rejection = rejection_rate > 2.0; needs_attention = is_below_target or has_high_rejection.' },
    { heading: '5. Assignment, membership, and expression precedence', body: 'The = operator assigns a value. Augmented assignments such as +=, -=, *=, and /= update an existing variable. The in operator checks membership in a sequence or collection. An expression combines values, variables, and operators to produce a result. Parentheses should be used when they make the intended order clear. Python generally evaluates exponentiation before multiplication/division, then addition/subtraction, then comparisons, then not, and, and or.', example: 'downtime = 30; downtime += 15 makes it 45. shift = "Night"; shift in ["Day", "Night"] returns True. Use (good_quantity / target) * 100 to make a percentage calculation explicit.' },
    { heading: '6. Validate input and avoid common errors', body: 'Never assume typed input is valid. Strip unnecessary spaces from text, check whether numeric text is valid, and handle ValueError when converting. Check for impossible values such as negative production quantities and avoid division by zero. Keep units clear: minutes, pieces, percentages, and hours must not be mixed accidentally.', example: 'try: actual = int(input("Actual pieces: ")); except ValueError: print("Enter a whole number.") is a simple starting point. A complete program should also check that actual is not negative.' }
  ],
  flow: ['Show a clear prompt', 'Read text using input()', 'Validate and convert the value', 'Calculate with operators', 'Display a formatted result', 'Check the result and edge cases'],
  code: `# Shift production summary
target = 500
actual_text = input("Enter actual production: ")
rejected_text = input("Enter rejected quantity: ")

try:
    actual = int(actual_text)
    rejected = int(rejected_text)

    if actual < 0 or rejected < 0:
        print("Quantities cannot be negative.")
    elif rejected > actual:
        print("Rejected quantity cannot exceed actual production.")
    elif target <= 0:
        print("Target must be greater than zero.")
    else:
        good_quantity = actual - rejected
        achievement = actual / target * 100
        rejection_rate = rejected / actual * 100 if actual else 0

        print(f"Good quantity: {good_quantity} pieces")
        print(f"Target achievement: {achievement:.2f}%")
        print(f"Rejection rate: {rejection_rate:.2f}%")
except ValueError:
    print("Please enter whole numbers only.")`,
  codeExplanation: [
    ['target = 500', 'Stores the shift target as an integer.'],
    ['actual_text = input(...)', 'Displays a prompt and stores the typed value as text.'],
    ['actual = int(actual_text)', 'Converts the input text into a whole number. Invalid text raises ValueError.'],
    ['if actual < 0 or rejected < 0:', 'Uses comparison and logical operators to reject impossible negative quantities.'],
    ['elif rejected > actual:', 'Checks that rejected pieces cannot be more than the total produced pieces.'],
    ['good_quantity = actual - rejected', 'Uses subtraction to calculate accepted pieces.'],
    ['achievement = actual / target * 100', 'Uses division and multiplication to calculate target achievement as a percentage.'],
    ['print(f"Good quantity: {good_quantity} pieces")', 'An f-string inserts the calculated value into a readable message.'],
    ['except ValueError:', 'Handles non-numeric input instead of allowing the program to crash.']
  ],
  output: 'Example input: actual = 438, rejected = 12\nGood quantity: 426 pieces\nTarget achievement: 87.60%\nRejection rate: 2.74%',
  practical: 'Create a shift summary from target, actual output, rejects, and downtime. The program should calculate good quantity, shortfall, achievement percentage, and rejection percentage, and reject invalid values.',
  tasks: [
    { level: 'Easy', prompt: 'Ask the user for their name, shift name, and production quantity. Print a formatted summary using an f-string.', hint: 'Remember that input() returns strings. Convert the production quantity to int before using it in calculations.' },
    { level: 'Medium', prompt: 'Ask for target, actual output, and rejected quantity. Calculate good quantity, shortfall, achievement percentage, and rejection percentage. Test a case where actual output is zero.', hint: 'Use int() for quantities. Check for zero before dividing and check that rejected quantity does not exceed actual output.' },
    { level: 'Practical', prompt: 'Build a shift report for target 500, actual 438, rejects 12, and downtime 45 minutes. Display good pieces, target shortfall, achievement %, rejection %, and downtime hours. Then modify it to accept input from the user and validate negative or non-numeric values.', hint: 'Use subtraction for good pieces and shortfall, division multiplied by 100 for percentages, and division by 60 for hours. Keep each unit in the output label.' }
  ],
  quiz: [
    { question: 'What data type does input() return?', options: ['int', 'float', 'str', 'bool'], answer: 2, explanation: 'input() always returns a string. Convert it with int() or float() before numeric calculations.' },
    { question: 'Which operator calculates the remainder?', options: ['/', '//', '%', '**'], answer: 2, explanation: '% returns the remainder. For 438 % 50, the result is 38.' },
    { question: 'What is the result of 7 // 2?', options: ['3.5', '3', '1', '4'], answer: 1, explanation: 'Floor division returns the floor of the division result. 7 divided by 2 is 3.5, so 7 // 2 is 3.' },
    { question: 'Which expression checks whether actual is below target?', options: ['actual = target', 'actual < target', 'actual + target', 'actual // target'], answer: 1, explanation: '< is a comparison operator and returns True when actual is less than target.' },
    { question: 'Why should a program check for target == 0 before calculating actual / target?', options: ['To avoid a syntax error', 'To avoid division by zero', 'To convert target to text', 'To make actual negative'], answer: 1, explanation: 'Dividing by zero raises ZeroDivisionError. Validate the denominator before calculating.' }
  ]
};
