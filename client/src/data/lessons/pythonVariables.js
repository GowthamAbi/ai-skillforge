export const PYTHON_VARIABLES_LESSON = {
  title: 'Variables, constants, data types, type conversion',
  outcomes: [
    'Explain variables as named references to values.',
    'Choose suitable Python data types for numeric, text, and logical data.',
    'Use naming conventions and understand reassignment.',
    'Convert values safely with int(), float(), str(), and bool().',
    'Identify common conversion errors and validate user input.'
  ],
  theory: [
    {heading:'1. Variables store and refer to values',body:'A variable is a name bound to an object in Python. Assignment uses the = operator: quantity = 250. The name can later be reassigned to another value. Python is dynamically typed, so you do not declare a fixed type before assigning. The type belongs to the value/object, and type(value) tells you its current type. Use descriptive snake_case names and avoid reserved keywords.',example:'actual_quantity = 438 assigns the integer value 438 to the name actual_quantity. Later, actual_quantity = 442 rebinds that name to a new integer value.'},
    {heading:'2. Constants are naming conventions',body:'Python does not enforce immutable constants through a special declaration keyword. By convention, names written in uppercase with underscores indicate values that should not be reassigned, such as TAX_RATE or MAX_RETRY_COUNT. This convention communicates intent to other developers; it does not prevent reassignment. For truly immutable structures, choose immutable types where appropriate.',example:'TARGET_QUANTITY = 500 communicates that the target is intended to remain fixed throughout the script.'},
    {heading:'3. Core built-in data types',body:'int represents whole numbers such as 25. float represents decimal numbers such as 12.5. str represents text such as "Machine A". bool represents True or False. NoneType has the single value None, often used to represent a missing or not-yet-provided value. Collections such as list, tuple, set, and dict are covered in the data-structures lessons. Select a type based on the meaning and operations required.',example:'machine_count = 8 is an int; downtime_hours = 1.5 is a float; shift_name = "Night" is a str; quality_passed = True is a bool.'},
    {heading:'4. Inspect a value with type()',body:'The type() function returns the type of an object. It is useful when debugging input and calculations. The print() function can display both values and type information. Remember that input() always returns text (str), even when the user types digits. Convert that text before performing numeric arithmetic.',example:'raw_count = input("Enter pieces: ") returns a string. int(raw_count) converts a valid whole-number string to an integer.'},
    {heading:'5. Type conversion and casting',body:'int(value) converts compatible values to integers; float(value) converts compatible numeric values to floating-point numbers; str(value) converts a value to text. bool(value) follows truth-value rules: zero, empty strings, empty collections, and None are false; most other objects are true. Converting "12.5" directly with int() raises ValueError; convert it to float first if a decimal is expected. Conversion can fail, so validate untrusted input with try/except.',example:'float("12.5") produces 12.5. int("12") produces 12. int("12.5") raises ValueError because the text is not an integer literal.'},
    {heading:'6. Common mistakes and good practices',body:'Do not add numeric strings without converting them: "10" + "5" produces "105", not 15. Do not use bool("False") to parse a textual yes/no answer: any non-empty string is truthy. Validate text explicitly. Avoid using float for exact financial calculations; Decimal is more suitable for money. Keep units in variable names when they prevent confusion, for example downtime_minutes.',example:'pieces_text = "125"; pieces = int(pieces_text); total = pieces + 25 produces 150.'}
  ],
  flow:['Receive a value','Inspect its type','Convert if required','Validate the converted value','Use it in a calculation'],
  code:'# Production quantity and type conversion example\nTARGET_QUANTITY = 500\n\nactual_text = "438"\nrejected_text = "12.5"\n\nactual_quantity = int(actual_text)\nrejected_quantity = float(rejected_text)\n\ngood_quantity = actual_quantity - int(rejected_quantity)\nshortfall = TARGET_QUANTITY - actual_quantity\nachievement_percent = (actual_quantity / TARGET_QUANTITY) * 100\n\nprint("Target type:", type(TARGET_QUANTITY).__name__)\nprint("Actual quantity:", actual_quantity)\nprint("Rejected quantity:", rejected_quantity)\nprint("Good quantity:", good_quantity)\nprint("Shortfall:", shortfall)\nprint("Achievement:", round(achievement_percent, 2), "%")\n\n# Safely convert user-provided numeric text\nuser_entry = "450"\ntry:\n    entered_quantity = int(user_entry)\n    print("Validated input:", entered_quantity)\nexcept ValueError:\n    print("Please enter a whole number.")',
  codeExplanation:[
    ['TARGET_QUANTITY = 500','An uppercase name follows the Python convention for a value intended to be constant. Its value is an int.'],
    ['actual_text = "438"','The quotes make this value a string, not a number.'],
    ['rejected_text = "12.5"','This is decimal numeric text, so float() is suitable for conversion.'],
    ['actual_quantity = int(actual_text)','int() converts the digit string "438" to integer 438.'],
    ['rejected_quantity = float(rejected_text)','float() converts decimal text to 12.5.'],
    ['good_quantity = actual_quantity - int(rejected_quantity)','The example converts the rejection amount to a whole-piece count before subtracting.'],
    ['type(TARGET_QUANTITY).__name__','type() inspects the value and __name__ displays the simple type name.'],
    ['achievement_percent = (actual_quantity / TARGET_QUANTITY) * 100','Division calculates the achievement ratio; multiplying by 100 expresses it as a percentage.'],
    ['try: ... except ValueError:','The try/except block handles invalid numeric text without crashing the program.']
  ],
  output:'Target type: int\nActual quantity: 438\nRejected quantity: 12.5\nGood quantity: 426\nShortfall: 62\nAchievement: 87.6 %\nValidated input: 450',
  practical:'A production dashboard receives values from forms, CSV files, or APIs. Those values may arrive as text. Convert and validate them before calculating output, rejection, downtime, or achievement. Keep units clear: downtime_minutes and downtime_hours should not be confused.',
  tasks:[
    {level:'Easy',prompt:'Create variables for machine_count (integer), downtime_hours (float), shift_name (string), and quality_passed (boolean). Print each value and its type.',hint:'Use type(value).__name__ to display the type name.'},
    {level:'Medium',prompt:'The strings actual_text = "475" and target_text = "500" are given. Convert them to integers and calculate the shortfall and achievement percentage.',hint:'Convert both with int(). Achievement = actual / target * 100.'},
    {level:'Practical',prompt:'A production form provides good pieces as "486" and rejected pieces as "14". Convert both values, calculate total inspected quantity and rejection percentage, and safely handle invalid input using try/except.',hint:'Total = good + rejected. Rejection percentage = rejected / total * 100. Catch ValueError around int() conversions.'}
  ],
  quiz:[
    {question:'What type does input() return by default?',options:['int','float','str','bool'],answer:2,explanation:'input() returns text. Convert it to int or float before numeric calculations.'},
    {question:'Which name follows the common Python constant convention?',options:['targetQuantity','Target-Quantity','TARGET_QUANTITY','target quantity'],answer:2,explanation:'Uppercase letters with underscores conventionally communicate a constant.'},
    {question:'What is type(8.5)?',options:['int','float','str','bool'],answer:1,explanation:'A number with a decimal point is a float.'},
    {question:'What happens with int("12.5")?',options:['Returns 12.5','Returns 12','Raises ValueError','Returns True'],answer:2,explanation:'The text is not a valid integer literal. Use float("12.5") for a decimal.'},
    {question:'What does bool("False") return?',options:['False','True','None','ValueError'],answer:1,explanation:'A non-empty string is truthy, even when its characters spell False. Parse yes/no text explicitly.'}
  ]
};
