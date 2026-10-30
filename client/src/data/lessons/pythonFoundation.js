export const PYTHON_FOUNDATION_LESSON = {
  title: 'Python introduction, installation, IDE, Jupyter Notebook, Google Colab',
  outcomes: [
    'Explain what Python is and where it is used in AI development.',
    'Distinguish the Python interpreter, an IDE, a notebook, and a cloud runtime.',
    'Run a Python script locally or in Google Colab.',
    'Inspect simple output and identify common beginner setup errors.'
  ],
  theory: [
    { heading: '1. What is Python?', body: 'Python is a high-level, general-purpose programming language. High-level means that its syntax is designed to be readable by people; the Python interpreter translates the program into instructions the computer can execute. Python is widely used in automation, data analysis, machine learning, deep learning, natural-language processing, and web backends.', example: 'A production supervisor can use Python to read daily production quantities, calculate averages, identify low-output shifts, and later train a model to estimate machine-breakdown risk.' },
    { heading: '2. Why Python is used in AI', body: 'AI work involves data preparation, numerical computation, model training, evaluation, and application integration. Python has a mature ecosystem for these tasks: NumPy for numerical arrays, pandas for tabular data, Matplotlib for charts, scikit-learn for classical machine learning, and PyTorch or TensorFlow for deep learning. The language itself does not automatically make a program intelligent; libraries provide tested building blocks and the developer designs the workflow.', example: 'A defect-prediction workflow may load a CSV with pandas, clean missing values, create features, train a scikit-learn classifier, and evaluate predictions.' },
    { heading: '3. Interpreter, IDE, notebook and runtime', body: 'The Python interpreter executes Python code. An IDE (Integrated Development Environment), such as VS Code or PyCharm, helps you edit files, navigate a project, debug, and run code. Jupyter Notebook is an interactive document made of cells; you can run one cell at a time and mix code, explanations, tables, and charts. Google Colab is a hosted notebook service that runs notebooks in a cloud runtime, so local Python installation is not required for the basic exercises.', example: 'Use VS Code when building a multi-file application. Use Jupyter or Colab when exploring a dataset, testing calculations, or learning a concept step by step.' },
    { heading: '4. How a Python program runs', body: 'You write source code in a .py file or notebook cell. The interpreter reads the code, checks its syntax, executes statements in order, and sends output to the console or notebook cell. A syntax error prevents the affected program from running; a runtime error occurs while the program is executing. Read the final line of an error message first, then inspect the line number and surrounding code.', example: 'The statement print("Hello, AI!") asks Python to display the text Hello, AI! on the output screen.' }
  ],
  flow: ['Problem / instructions', 'Python source code', 'Python interpreter / runtime', 'Output or saved result'],
  code: '# Your first Python program\nprint("Hello, AI SkillForge!")\n\n# Python can also calculate values\nproduction_today = 128\nproduction_target = 150\nremaining = production_target - production_today\nprint("Production today:", production_today)\nprint("Units remaining:", remaining)',
  codeExplanation: [
    ['print("Hello, AI SkillForge!")', 'Calls the built-in print function and displays the text inside the quotation marks.'],
    ['production_today = 128', 'Creates a variable named production_today and stores the integer 128.'],
    ['production_target = 150', 'Stores the target quantity in a second variable.'],
    ['remaining = production_target - production_today', 'Subtracts actual production from the target and stores the result.'],
    ['print("Production today:", production_today)', 'Displays a label followed by the value stored in the variable.'],
    ['print("Units remaining:", remaining)', 'Displays the calculated difference.']
  ],
  output: 'Hello, AI SkillForge!\nProduction today: 128\nUnits remaining: 22',
  practical: 'Imagine your department has a target of 150 elastic pieces per shift and has produced 128 pieces. This small program calculates that 22 pieces remain. Later lessons will extend this into lists, CSV reports, charts, and machine-learning datasets.',
  tasks: [
    { level: 'Easy', prompt: 'Create a Python program that prints your name, your learning goal, and the words “I am learning Python”.', hint: 'Use three print() statements. Put text inside matching single or double quotation marks.' },
    { level: 'Medium', prompt: 'Store planned production as 500 and actual production as 437. Calculate and print the shortfall and achievement percentage.', hint: 'shortfall = planned - actual. Percentage = actual / planned * 100.' },
    { level: 'Practical', prompt: 'A machine is scheduled for 8 hours. It stopped for 45 minutes. Calculate productive minutes and productive hours.', hint: 'Convert 8 hours to minutes first: 8 * 60. Then subtract downtime.' }
  ],
  quiz: [
    { question: 'Which statement best describes Python?', options: ['A high-level general-purpose programming language', 'A database only', 'A spreadsheet application', 'A computer operating system'], answer: 0, explanation: 'Python is a general-purpose language used in automation, data, AI, web development and more.' },
    { question: 'What is the main role of the Python interpreter?', options: ['Design website layouts', 'Execute Python instructions', 'Store files permanently', 'Create internet connections automatically'], answer: 1, explanation: 'The interpreter executes Python code.' },
    { question: 'Which tool is especially useful for interactive cell-by-cell data exploration?', options: ['Jupyter Notebook', 'A plain image viewer', 'A music player', 'A PDF reader'], answer: 0, explanation: 'Jupyter notebooks let you execute cells independently and combine code with notes and output.' },
    { question: 'What does Google Colab provide?', options: ['Only an offline text editor', 'A hosted notebook environment with a cloud runtime', 'A replacement for all programming languages', 'A physical computer'], answer: 1, explanation: 'Colab hosts notebooks and provides a cloud execution environment.' },
    { question: 'What is the output of 150 - 128?', options: ['12', '18', '22', '28'], answer: 2, explanation: '150 minus 128 equals 22.' }
  ]
};
