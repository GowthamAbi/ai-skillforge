export const PYTHON_CONDITIONALS_LESSON = {
  title: 'Conditional statements: if, elif, else',
  outcomes: [
    'Explain Boolean conditions and decision-making in a program.',
    'Write if, elif, and else blocks with correct indentation.',
    'Combine conditions with and, or, and not.',
    'Order conditions so the most specific cases are handled correctly.',
    'Test boundary values and avoid overlapping or unreachable branches.'
  ],
  theory: [
    {heading:'1. Why programs need decisions',body:'A conditional lets a program choose which instructions to run based on a condition. A condition is an expression that evaluates to True or False. Instead of printing the same result for every shift, a production report can classify output as on target, below target, or above target. Python uses if, elif, and else to express these branches.',example:'If actual production is at least 500, show “Target achieved”; otherwise show “Target not achieved”.'},
    {heading:'2. The if statement',body:'An if statement evaluates its condition. When the condition is True, Python executes the indented block. The colon after the condition is required, and the block must be indented consistently, usually by four spaces. If the condition is False, Python skips that block and continues after it.',example:'if actual >= target: followed by an indented print("Target achieved").'},
    {heading:'3. elif and else',body:'Use elif to test another condition only when earlier conditions were False. You can have multiple elif branches. else is optional and runs when none of the previous conditions matched. Only the first matching branch in one if/elif/else chain runs. Arrange branches carefully: a broad condition placed too early can prevent a more specific condition from ever running.',example:'Check actual > target first, then actual == target, and finally else for below-target production.'},
    {heading:'4. Combining conditions',body:'Use and when every condition must be True, or when at least one condition must be True, and not to reverse a Boolean value. Parentheses make complex expressions clearer. Python also supports chained comparisons such as 0 <= rejection_rate <= 2. A condition should express a business rule precisely, not merely make the code run.',example:'if actual < target and downtime_minutes > 30: identifies a shift that missed target and experienced more than 30 minutes of downtime.'},
    {heading:'5. Nested decisions and validation',body:'A nested if places one decision inside another. Nest only when the second decision depends on the first; otherwise use combined conditions to keep code readable. Validate input before applying business rules. For example, reject negative quantities before comparing actual production with target. Clear validation prevents impossible records from receiving misleading classifications.',example:'First check whether actual is negative. Only if it is valid should the program classify it as below, on, or above target.'},
    {heading:'6. Test boundaries and common mistakes',body:'Test values immediately below, equal to, and above a threshold. For target 500, test 499, 500, and 501. Watch for using = instead of ==, missing colons, inconsistent indentation, and conditions in the wrong order. Write down expected classifications before running the program and compare them with actual results.',example:'A quality rule might classify rejection rates <= 2% as acceptable, rates above 2% and <= 5% as warning, and rates above 5% as critical.'}
  ],
  flow:['Receive and validate input','Evaluate the first if condition','If false, evaluate the next elif condition','Run the first matching branch','If none match, run else','Test threshold boundaries'],
  code:`target = 500
actual = 438
rejected = 12
downtime_minutes = 45

if actual < 0 or rejected < 0:
    status = "Invalid production data"
elif rejected > actual:
    status = "Invalid rejection quantity"
elif actual > target:
    status = "Above target"
elif actual == target:
    status = "Target achieved exactly"
else:
    status = "Below target"

if actual > 0:
    rejection_rate = rejected / actual * 100
else:
    rejection_rate = 0

if rejection_rate > 5:
    quality_status = "Critical"
elif rejection_rate > 2:
    quality_status = "Warning"
else:
    quality_status = "Acceptable"

print("Production status:", status)
print("Quality status:", quality_status)
if status == "Below target" and downtime_minutes > 30:
    print("Action: investigate machine downtime")`,
  codeExplanation:[
    ['if actual < 0 or rejected < 0:', 'Rejects invalid negative values before applying production rules.'],
    ['elif rejected > actual:', 'Checks another invalid-data condition only when the first condition is false.'],
    ['elif actual > target:', 'Classifies production above the target.'],
    ['elif actual == target:', 'Checks exact equality. == compares values; = assigns values.'],
    ['else:', 'Handles the remaining valid case, which is below target.'],
    ['if actual > 0:', 'Prevents division by zero before calculating rejection percentage.'],
    ['if rejection_rate > 5:', 'Checks the highest severity first so critical quality cases are not caught by a broader rule.'],
    ['if status == "Below target" and downtime_minutes > 30:', 'Combines two conditions; both must be True to recommend a downtime investigation.']
  ],
  output:'Production status: Below target\nQuality status: Warning\nAction: investigate machine downtime',
  practical:'Create a production decision system that validates quantities, classifies target achievement, classifies quality risk, and recommends an action when low production coincides with long downtime.',
  tasks:[
    {level:'Easy',prompt:'Write an if/else program that checks whether a production quantity is at least 500 pieces.',hint:'Use actual >= 500 and remember the colon and four-space indentation.'},
    {level:'Medium',prompt:'Classify a shift as Above Target, On Target, or Below Target. Test 499, 500, and 501.',hint:'Use if actual > target, elif actual == target, and else.'},
    {level:'Practical',prompt:'Build a decision system: invalid if quantities are negative or rejects exceed actual; quality is Acceptable at <=2%, Warning above 2% through 5%, and Critical above 5%. Also recommend downtime investigation if output is below target and downtime exceeds 30 minutes.',hint:'Validate first. Check Critical before Warning. Protect the rejection-rate calculation when actual is zero.'}
  ],
  quiz:[
    {question:'Which keyword starts a conditional block in Python?',options:['when','if','check','case'],answer:1,explanation:'if evaluates a Boolean condition and runs its indented block when the condition is True.'},
    {question:'When does else execute?',options:['Whenever if is true','Only when every earlier if/elif condition is false','Before if','On every loop iteration'],answer:1,explanation:'else is the fallback branch when no preceding branch in that chain matched.'},
    {question:'What does 500 == 500 return?',options:['False','500','True','None'],answer:2,explanation:'== compares two values and returns True when they are equal.'},
    {question:'Which operator requires both conditions to be true?',options:['or','not','and','in'],answer:2,explanation:'and returns True only when both operands are truthy.'},
    {question:'Why should a > 5 condition be checked before a > 2 condition for quality severity?',options:['Python checks the last branch first','The broader condition would capture values above 5 first','elif cannot compare numbers','It changes the numeric value'],answer:1,explanation:'An elif chain stops at the first match. Checking >2 first would incorrectly label values above 5 as Warning.'}
  ]
};

export const PYTHON_LOOPS_LESSON = {
  title: 'Loops: for, while, break, continue, range()',
  outcomes:[
    'Explain iteration and identify when a loop is useful.',
    'Use for with sequences and range() for counted repetition.',
    'Use while with a condition and update loop state safely.',
    'Control execution with break and continue.',
    'Avoid infinite loops and calculate totals from production records.'
  ],
  theory:[
    {heading:'1. What is iteration?',body:'A loop repeats a block of instructions. Iteration is useful when the same operation must be performed for many values, such as calculating output across several shifts or checking every machine record. A loop reduces repeated code and makes the process consistent. Every loop should have a clear stopping condition or a finite collection to process.',example:'Instead of writing a separate print statement for each of five machines, store the machine names in a list and loop through them.'},
    {heading:'2. for loops and sequences',body:'A for loop takes one item at a time from an iterable, such as a list, tuple, string, or range. The loop variable refers to the current item during that iteration. The indented block runs once per item. When there are no more items, the loop ends automatically.',example:'for shift in ["Day", "Evening", "Night"]: prints each shift name once.'},
    {heading:'3. range() for counted repetition',body:'range(stop) produces integer values from zero up to, but not including, stop. range(start, stop) starts at start. range(start, stop, step) changes the increment. The stop value is excluded. range() is commonly used when you need a known number of repetitions or an index.',example:'range(1, 4) produces 1, 2, 3. It does not include 4.'},
    {heading:'4. while loops and loop state',body:'A while loop repeats while its condition remains True. Update the variable used by the condition so that the loop can eventually stop. If the condition never becomes False and there is no break, the loop becomes infinite. Use while when the number of repetitions is not known in advance but a stopping condition is known.',example:'attempts = 0; while attempts < 3: print(attempts); attempts += 1 repeats three times.'},
    {heading:'5. break and continue',body:'break exits the nearest enclosing loop immediately. continue skips the rest of the current iteration and moves to the next one. Use break when a stop condition is reached, such as finding a critical machine alert. Use continue to skip a record that should not be included, such as a missing or invalid reading. Avoid using them when a simple condition would be clearer.',example:'If a machine record is marked "maintenance", continue skips it; if a critical fault is found, break stops the search.'},
    {heading:'6. Accumulators, nested loops, and safe loop design',body:'An accumulator stores a running result, such as total production. Initialize it before the loop and update it on each iteration. Nested loops place one loop inside another and are useful for combinations such as shifts and machines, but they increase the number of operations. Test empty collections, one item, and larger inputs. For while loops, confirm that every path updates the state or exits.',example:'total_output = 0; for quantity in [150, 140, 148]: total_output += quantity calculates the combined output.'}
  ],
  flow:['Prepare a collection or stopping condition','Start the loop','Read the current item or check condition','Run the loop body and update state','Use continue to skip or break to exit when needed','Repeat until finished and inspect the result'],
  code:`machine_outputs = [150, 140, 0, 148, 162]
total_output = 0
valid_machine_count = 0

for quantity in machine_outputs:
    if quantity < 0:
        print("Invalid reading; skipped")
        continue
    if quantity == 0:
        print("Machine with zero output found")
        continue

    total_output += quantity
    valid_machine_count += 1

if valid_machine_count > 0:
    average_output = total_output / valid_machine_count
    print("Total output:", total_output)
    print("Machines counted:", valid_machine_count)
    print("Average output:", round(average_output, 2))

attempt = 0
while attempt < 3:
    print("Inspection attempt:", attempt + 1)
    attempt += 1`,
  codeExplanation:[
    ['machine_outputs = [150, 140, 0, 148, 162]', 'Creates a list of sample output readings, one value per machine.'],
    ['for quantity in machine_outputs:', 'Visits each quantity in the list once.'],
    ['if quantity < 0:', 'Checks whether a reading is invalid.'],
    ['continue', 'Skips the remaining statements for this reading and moves to the next item.'],
    ['if quantity == 0:', 'Identifies a machine that produced zero pieces.'],
    ['total_output += quantity', 'Adds the current valid reading to the running total.'],
    ['valid_machine_count += 1', 'Counts only the readings included in the total.'],
    ['while attempt < 3:', 'Repeats the inspection while the attempt count is below three.'],
    ['attempt += 1', 'Updates the loop variable so the while condition eventually becomes False.']
  ],
  output:'Machine with zero output found\nTotal output: 600\nMachines counted: 4\nAverage output: 150.0\nInspection attempt: 1\nInspection attempt: 2\nInspection attempt: 3',
  practical:'Process a list of machine or shift production quantities. Skip invalid and zero readings, calculate total and average output, and use a while loop to simulate a limited number of inspection attempts.',
  tasks:[
    {level:'Easy',prompt:'Use a for loop and range() to print numbers from 1 to 10 and calculate their total.',hint:'range(1, 11) includes 1 through 10. Initialize total = 0 before the loop.'},
    {level:'Medium',prompt:'Given outputs [150, 140, 0, 148, 162], skip zero values with continue and calculate total and average of non-zero readings.',hint:'Update total and count only after the zero check. Divide only when count is greater than zero.'},
    {level:'Practical',prompt:'Create a machine inspection loop that reads a list of readings, skips invalid negative values, reports zero-output machines, totals valid positive readings, and stops searching when a reading reaches a critical threshold of 200 pieces.',hint:'Use continue for invalid or zero values and break for the critical threshold. Decide whether the threshold reading should be included before or after the break and document that rule.'}
  ],
  quiz:[
    {question:'What does range(1, 4) produce?',options:['1, 2, 3, 4','0, 1, 2, 3','1, 2, 3','2, 3, 4'],answer:2,explanation:'The start is included and the stop is excluded, so the values are 1, 2, and 3.'},
    {question:'Which loop is commonly used to visit every item in a list?',options:['for','if','try','class'],answer:0,explanation:'for iterates over the items in an iterable such as a list.'},
    {question:'What does break do?',options:['Skips only the current iteration','Exits the nearest loop','Restarts the program','Pauses for one second'],answer:1,explanation:'break immediately exits the nearest enclosing loop.'},
    {question:'What is the main risk if a while loop condition never becomes false?',options:['SyntaxError','Infinite loop','Automatic type conversion','The list becomes sorted'],answer:1,explanation:'Without a changing condition or a break, the loop may continue forever.'},
    {question:'What does continue do?',options:['Ends the entire program','Exits all nested loops','Skips to the next iteration','Repeats the same item forever'],answer:2,explanation:'continue skips the rest of the current iteration and proceeds to the next one.'}
  ]
};
