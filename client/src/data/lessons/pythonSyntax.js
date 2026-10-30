export const PYTHON_SYNTAX_LESSON = {
  title: 'Syntax, indentation, comments, keywords, identifiers',
  outcomes: [
    'Write valid Python statements and recognize syntax errors.',
    'Use indentation to define code blocks consistently.',
    'Add single-line and multi-line explanatory comments.',
    'Distinguish reserved keywords from valid identifiers.',
    'Choose readable variable and function names using Python conventions.'
  ],
  theory: [
    { heading: '1. What is Python syntax?', body: 'Syntax is the set of rules that defines how Python statements must be written. A statement is an instruction that Python can execute, such as assigning a value or calling print(). Python uses line breaks to separate many statements. Parentheses, brackets, braces, and explicit continuation rules allow expressions to span multiple lines. A SyntaxError means Python cannot parse the code as written.', example: 'print("Shift report") is valid. Writing print("Shift report" without the closing parenthesis causes a SyntaxError.' },
    { heading: '2. Indentation defines code blocks', body: 'Python uses leading whitespace to show which statements belong to a block after constructs such as if, for, while, def, and class. Use four spaces per indentation level and be consistent. Do not mix tabs and spaces. A missing or inconsistent indentation can raise IndentationError or TabError. Indentation is part of Python syntax, not merely visual formatting.', example: 'After if production < target:, indent the print statement by four spaces so it belongs to the if block.' },
    { heading: '3. Comments explain intent', body: 'A comment begins with # and is ignored by the Python interpreter. Use comments to explain why a decision is made, clarify a non-obvious calculation, or record an important assumption. Avoid comments that merely repeat obvious code. Triple-quoted strings are often used as docstrings immediately inside modules, functions, and classes; they are documentation strings, not ordinary comment tokens.', example: '# Calculate the production shortfall explains the purpose of the next calculation.' },
    { heading: '4. Keywords are reserved words', body: 'Keywords have special meaning in Python grammar and cannot be used as ordinary variable or function names. Examples include if, else, for, while, def, return, class, True, False, and None. The exact keyword set can vary between Python versions. You can inspect the active interpreter using the keyword module.', example: 'if is a keyword, so if = 10 is invalid. Use shift_count = 10 instead.' },
    { heading: '5. Identifiers name program elements', body: 'An identifier is a name used for a variable, function, class, or other program element. It may contain letters, digits, and underscores, but it cannot start with a digit and cannot be a keyword. Python is case-sensitive: total, Total, and TOTAL are different names. Prefer descriptive snake_case names for variables and functions, and CapWords for class names.', example: 'daily_output and rejection_rate are readable identifiers. 2nd_shift and machine-status are invalid identifiers.' },
    { heading: '6. Readability and PEP 8', body: 'PEP 8 is the widely used Python style guide. It recommends four spaces per indentation level, readable line lengths, imports at the top of a file, and consistent naming. Style consistency makes code easier to review, debug, and maintain, especially when a project grows beyond one file.', example: 'Use calculate_rejection_rate() rather than calc1() when the function calculates a rejection rate.' }
  ],
  flow: ['Read the statement', 'Check Python grammar', 'Check indentation and names', 'Interpreter executes the valid code'],
  code: '# A readable Python example showing syntax rules\nplanned_quantity = 500\nactual_quantity = 437\n\n# Calculate how many pieces are still required\nshortfall = planned_quantity - actual_quantity\n\nif actual_quantity < planned_quantity:\n    print("Production is below target")\n    print("Shortfall:", shortfall)\nelse:\n    print("Target achieved")\n\ndef calculate_achievement(actual, planned):\n    """Return production achievement as a percentage."""\n    return (actual / planned) * 100\n\nachievement_rate = calculate_achievement(actual_quantity, planned_quantity)\nprint("Achievement:", round(achievement_rate, 2), "%")',
  codeExplanation: [
    ['planned_quantity = 500', 'A valid identifier is assigned an integer value. The underscore makes the name readable.'],
    ['# Calculate how many pieces are still required', 'The hash symbol starts a comment. Python ignores this line during execution.'],
    ['shortfall = planned_quantity - actual_quantity', 'Python evaluates the subtraction expression and stores the result.'],
    ['if actual_quantity < planned_quantity:', 'The if keyword begins a conditional block. The colon indicates that an indented suite follows.'],
    ['    print("Production is below target")', 'Four leading spaces place this statement inside the if block.'],
    ['else:', 'The else keyword defines the alternative branch when the if condition is false.'],
    ['def calculate_achievement(actual, planned):', 'The def keyword defines a function. actual and planned are parameter identifiers.'],
    ['    return (actual / planned) * 100', 'return sends the calculated percentage back to the caller.'],
    ['achievement_rate = calculate_achievement(actual_quantity, planned_quantity)', 'The function is called with two arguments and its returned value is assigned.']
  ],
  output: 'Production is below target\nShortfall: 63\nAchievement: 87.4 %',
  practical: 'In a production report, readable names such as planned_quantity, actual_quantity, downtime_minutes, and rejection_rate help supervisors and developers understand calculations quickly. Consistent indentation keeps conditions and loops from accidentally running in the wrong block.',
  tasks: [
    { level: 'Easy', prompt: 'Write three valid Python statements: create a variable named machine_count, assign it 12, and print it. Add a comment above the variable.', hint: 'Use machine_count = 12 and print(machine_count). A comment starts with #.' },
    { level: 'Medium', prompt: 'Create a condition that checks whether actual production is below a target. Print a different message for each outcome. Ensure the print statements are indented correctly.', hint: 'Start with if actual < target: then indent the statement. Add else: at the original indentation level.' },
    { level: 'Practical', prompt: 'Create a function named calculate_downtime_hours that accepts downtime_minutes and returns hours. Use descriptive identifiers and a docstring. Call the function with 90 minutes.', hint: 'Convert minutes to hours by dividing by 60. Put the return statement inside the function block.' }
  ],
  quiz: [
    { question: 'What does indentation define in Python?', options: ['The color of code', 'The boundaries of code blocks', 'The file name', 'The computer memory size'], answer: 1, explanation: 'Indentation determines which statements belong to a block such as an if statement or function.' },
    { question: 'Which line starts a Python comment?', options: ['// comment', '<!-- comment -->', '# comment', '** comment'], answer: 2, explanation: 'A hash character starts a single-line Python comment.' },
    { question: 'Which of these is a Python keyword?', options: ['production_total', 'calculate_rate', 'while', 'machine_count'], answer: 2, explanation: 'while is a reserved keyword used to create a loop.' },
    { question: 'Which is a valid Python identifier?', options: ['2nd_shift', 'machine-status', 'daily_output', 'class'], answer: 2, explanation: 'daily_output begins with a letter and contains only letters and underscores. class is reserved, while the other two violate identifier rules.' },
    { question: 'What is the recommended common indentation level?', options: ['Two spaces', 'Four spaces', 'Eight tabs', 'No indentation'], answer: 1, explanation: 'PEP 8 recommends four spaces per indentation level.' }
  ]
};
