// Curriculum outline based on the learner-provided AI syllabus.
// Structure: Phase -> Main heading -> Subheading -> lesson topics.
export const AI_PHASES = [
  { id:'p1', title:'Phase 1 — Programming Foundations', duration:'4–6 weeks', description:'Python, mathematics, data analysis and developer tools.', groups:[
    { id:'python', title:'Python Programming', sections:[
      {title:'Python Basics', topics:['Python introduction, installation, IDE, Jupyter Notebook, Google Colab','Syntax, indentation, comments, keywords, identifiers','Variables, constants, data types, type conversion','Input, output, operators, expressions','Conditional statements: if, elif, else','Loops: for, while, break, continue, range()']},
      {title:'Python Data Structures', topics:['Strings, indexing, slicing, string methods','Lists, list methods, nested lists, list comprehension','Tuples, sets, dictionaries','Mutable vs immutable objects','Sorting, searching, iteration']},
      {title:'Functions and Advanced Python', topics:['Functions, parameters, arguments, return values','Scope, lambda, recursion','Modules, packages, imports','Exception handling: try, except, finally','File handling: TXT, CSV, JSON','Object-Oriented Programming: classes, objects, inheritance, polymorphism','Iterators, generators, decorators','Type hints, virtual environments, dependency management']}
    ]},
    {id:'math',title:'Mathematics for AI',sections:[
      {title:'Linear Algebra',topics:['Scalars, vectors, matrices, tensors','Matrix operations, transpose, multiplication','Dot product, vector norms','Linear transformations','Eigenvalues and eigenvectors — foundational understanding']},
      {title:'Calculus',topics:['Functions, graphs, limits','Derivatives and partial derivatives','Chain rule','Gradients and gradient descent','Integration — essential fundamentals']},
      {title:'Probability and Statistics',topics:['Mean, median, mode, variance, standard deviation','Probability, conditional probability, Bayes’ theorem','Random variables and probability distributions','Normal, binomial and Bernoulli distributions','Sampling, correlation, covariance','Hypothesis testing, confidence intervals, p-values']}
    ]},
    {id:'data',title:'Data Analysis and Tools',sections:[
      {title:'Data Handling',topics:['NumPy arrays and vectorization','Pandas Series and DataFrames','Missing values, duplicates, outliers','Data cleaning and transformation','Matplotlib and Seaborn visualizations']},
      {title:'Developer Tools',topics:['SQL: SELECT, WHERE, GROUP BY, JOIN','Git, GitHub, branches, commits','Linux terminal basics','APIs, JSON, HTTP fundamentals','Debugging, testing and readable code']}
    ]},
    {id:'p1project',title:'Phase 1 Project',sections:[{title:'Elastic Production Data Analysis',topics:['Analyze daily production quantity with Python','Analyze machine breakdowns and downtime','Calculate rejection rate and quality trends','Measure delivery performance and present a summary']} ]}
  ]},
  {id:'p2',title:'Phase 2 — Machine Learning',duration:'6–8 weeks',description:'Prepare data, build supervised and unsupervised models, evaluate and improve them.',groups:[
    {id:'mlfund',title:'ML Fundamentals',sections:[
      {title:'Introduction',topics:['AI vs ML vs Deep Learning','Types of Machine Learning','Features, labels, datasets, observations','Training, validation and testing datasets','ML workflow and problem definition']},
      {title:'Data Preparation',topics:['Exploratory Data Analysis (EDA)','Encoding categorical variables','Normalization and standardization','Feature selection and feature engineering','Data leakage and imbalanced datasets','Scikit-learn pipelines']}
    ]},
    {id:'supervised',title:'Supervised Learning',sections:[
      {title:'Regression',topics:['Simple and multiple linear regression','Polynomial regression','Ridge and Lasso regression','Decision tree regression','Random forest and gradient boosting']},
      {title:'Classification',topics:['Logistic regression','K-Nearest Neighbors (KNN)','Decision trees','Random forests','Support Vector Machines (SVM)','Naive Bayes','XGBoost / gradient boosting concepts']}
    ]},
    {id:'unsupervised',title:'Unsupervised Learning',sections:[
      {title:'Clustering',topics:['K-Means','Hierarchical clustering','DBSCAN','Choosing the number of clusters']},
      {title:'Dimensionality Reduction',topics:['Principal Component Analysis (PCA)','Feature reduction','Visualizing high-dimensional data']}
    ]},
    {id:'mleval',title:'Model Evaluation and Improvement',sections:[
      {title:'Evaluation Metrics',topics:['MAE, MSE, RMSE, R²','Accuracy, precision, recall, F1-score','Confusion matrix and ROC-AUC','Cross-validation']},
      {title:'Model Optimization',topics:['Overfitting and underfitting','Bias-variance trade-off','Regularization','Hyperparameter tuning','Grid search and randomized search']},
      {title:'Additional ML Topics',topics:['Ensemble learning','Time-series forecasting','Anomaly detection','Recommendation systems','Introduction to reinforcement learning']}
    ]},
    {id:'p2project',title:'Phase 2 Projects',sections:[{title:'Production ML Projects',topics:['Machine breakdown prediction','Production quantity forecasting','Elastic quality defect classification','Product rejection and delivery delay prediction']} ]}
  ]},
  {id:'p3',title:'Phase 3 — Deep Learning',duration:'6–8 weeks',description:'Neural networks, PyTorch and modern deep learning architectures.',groups:[
    {id:'nn',title:'Neural Network Fundamentals',sections:[
      {title:'Artificial Neurons',topics:['Biological neuron vs artificial neuron','Weights, biases and weighted sums','Activation functions: ReLU, sigmoid, tanh, softmax','Forward propagation','Loss functions']},
      {title:'Training Neural Networks',topics:['Backpropagation','Gradient descent and stochastic gradient descent','Optimizers: SGD, Adam, AdamW','Learning rate, batch size, epochs','Weight initialization','Dropout, batch normalization, early stopping']}
    ]},
    {id:'frameworks',title:'Deep Learning Frameworks',sections:[
      {title:'PyTorch',topics:['Tensors and tensor operations','Autograd and computational graphs','Building models with nn.Module','Training and validation loops','Dataset and DataLoader','GPU training and model saving']},
      {title:'Supporting Concepts',topics:['TensorFlow and Keras overview','CPU vs GPU','Experiment tracking','Reproducibility and random seeds']}
    ]},
    {id:'architectures',title:'Deep Learning Architectures',sections:[
      {title:'Computer Vision',topics:['Image representation and preprocessing','Convolutional Neural Networks (CNN)','Pooling, filters and feature maps','Transfer learning','Object detection and image segmentation']},
      {title:'Sequential Models',topics:['Recurrent Neural Networks (RNN)','LSTM and GRU','Sequence modeling','Attention mechanism','Transformers']},
      {title:'Advanced Topics',topics:['Autoencoders','Generative Adversarial Networks (GANs)','Diffusion models — fundamentals and applications','Self-supervised learning','Multimodal neural networks']}
    ]},
    {id:'p3project',title:'Phase 3 Projects',sections:[{title:'Applied Deep Learning',topics:['Image-based quality inspection','Defect detection','Spoken-language classification']} ]}
  ]},
  {id:'p4',title:'Phase 4 — NLP (Natural Language Processing)',duration:'4–6 weeks',description:'Text processing, language tasks, transformers and NLP evaluation.',groups:[
    {id:'text',title:'Text Processing Fundamentals',sections:[
      {title:'Text Preparation',topics:['Corpus, documents, sentences, tokens','Sentence splitting and tokenization','Stop words, stemming, lemmatization','Regular expressions and text normalization','Unicode and multilingual text handling']},
      {title:'Text Representation',topics:['Bag of Words','N-grams','TF-IDF','Word2Vec and GloVe','Word embeddings vs contextual embeddings']}
    ]},
    {id:'nlptasks',title:'NLP Tasks',sections:[
      {title:'Text Understanding',topics:['Text classification','Sentiment analysis','Named Entity Recognition (NER)','Part-of-Speech tagging','Intent classification','Semantic similarity and search']},
      {title:'Language Generation and Translation',topics:['Language modeling','Machine translation','Text summarization','Question answering','Spell checking and grammar correction']}
    ]},
    {id:'modernnlp',title:'Modern NLP',sections:[
      {title:'Transformers',topics:['Encoder, decoder and encoder-decoder','Self-attention and positional encoding','BERT-style models','GPT-style models','Hugging Face Transformers and tokenizers']},
      {title:'NLP Evaluation',topics:['Train/test evaluation','Precision, recall and F1 for NLP','BLEU and ROUGE','Human evaluation and semantic quality']}
    ]},
    {id:'p4project',title:'Phase 4 Projects',sections:[{title:'Applied NLP',topics:['English grammar correction','Customer feedback sentiment analysis','Tamil-English text assistant','Interview-answer evaluator']} ]}
  ]},
  {id:'p5',title:'Phase 5 — Generative AI (GenAI)',duration:'6–8 weeks',description:'LLMs, prompt engineering, APIs, RAG, adaptation, agents and multimodal AI.',groups:[
    {id:'genfund',title:'Generative AI Fundamentals',sections:[
      {title:'Core Concepts',topics:['AI vs ML vs DL vs NLP vs GenAI','Discriminative vs generative models','Foundation models and pretraining','Large Language Models (LLMs)','Tokens, context windows and token limits','Model parameters and inference']},
      {title:'How LLMs Work',topics:['Transformer architecture recap','Next-token prediction','Tokenization and embeddings','Attention and context','Temperature, top-k and top-p sampling','Hallucinations and model limitations']}
    ]},
    {id:'prompt',title:'Prompt Engineering',sections:[
      {title:'Prompt Design',topics:['Zero-shot prompting','One-shot and few-shot prompting','System, developer and user instructions','Role, context, constraints and examples','Structured output: JSON and schemas','Prompt templates and reusable prompts']},
      {title:'Advanced Prompting',topics:['Task decomposition','Reasoning-oriented prompting and verification','Multi-step workflows','Prompt injection and untrusted inputs','Prompt testing and versioning']}
    ]},
    {id:'apis',title:'Working with AI APIs',sections:[
      {title:'API Integration',topics:['API keys and secure environment variables','Requests, responses and authentication','Chat and text generation','Streaming responses','Error handling, retries and rate limits','Token usage, latency and cost tracking']},
      {title:'Model Capabilities',topics:['Text generation and rewriting','Structured data extraction','Image understanding','Audio transcription and generation','Model selection and capability comparison']}
    ]},
    {id:'rag',title:'Retrieval-Augmented Generation (RAG)',sections:[
      {title:'RAG Fundamentals',topics:['Why RAG is needed','Document loading and parsing','Chunking and metadata','Embedding models','Vector databases and similarity search','Retrieval, context construction and generation']},
      {title:'Advanced RAG',topics:['Chunk-size optimization','Hybrid search and reranking','Query rewriting and metadata filtering','Grounded answers and citations','Retrieval evaluation and failure analysis']}
    ]},
    {id:'finetune',title:'Fine-Tuning and Model Adaptation',sections:[
      {title:'Fine-Tuning Fundamentals',topics:['Prompting vs RAG vs fine-tuning','Dataset creation and quality','Supervised fine-tuning','Training and validation splits']},
      {title:'Efficient Adaptation',topics:['LoRA and QLoRA','Parameter-efficient fine-tuning','Training evaluation','Overfitting and model regression','Model quantization and inference optimization']}
    ]},
    {id:'agents',title:'AI Agents and Multimodal GenAI',sections:[
      {title:'AI Agents',topics:['LLM vs AI agent','Tools and function calling','Planning and task execution','Memory and conversation state','Single-agent and multi-agent workflows','Guardrails, permissions and human approval']},
      {title:'Multimodal AI',topics:['Text and image models','Speech-to-text and text-to-speech','Real-time voice interaction','Audio, video and document understanding','Multimodal RAG']}
    ]},
    {id:'p5project',title:'Phase 5 Projects',sections:[{title:'Generative AI Applications',topics:['PDF question-answering chatbot using RAG','Personal AI study assistant','AI interview preparation assistant','Voice-based English-speaking coach']} ]}
  ]},
  {id:'p6',title:'Phase 6 — AI Engineering',duration:'6–8 weeks; continue improving after advanced deployment',description:'Build, test, secure, deploy and monitor production AI systems.',groups:[
    {id:'software',title:'Software Engineering for AI',sections:[
      {title:'Backend Development',topics:['Python application structure','FastAPI and REST APIs','Request validation and response schemas','Authentication and authorization','Async programming and streaming','Logging, error handling and testing']},
      {title:'Databases and Storage',topics:['SQL databases and data modeling','MongoDB and document databases','Conversation and user-history storage','Vector databases','Cache systems and Redis','Database indexes and query performance']}
    ]},
    {id:'architecture',title:'AI Application Architecture',sections:[
      {title:'Application Design',topics:['Frontend, backend and model architecture','Model APIs vs self-hosted models','AI orchestration and reusable services','RAG pipeline design','Background jobs and task queues','Real-time WebSockets and streaming']},
      {title:'AI Frameworks',topics:['Hugging Face ecosystem','LangChain fundamentals','LangGraph and stateful workflows','LlamaIndex for data-centric applications','Choosing frameworks based on project needs']}
    ]},
    {id:'quality',title:'Testing, Evaluation and Security',sections:[
      {title:'AI Quality',topics:['Unit, integration and end-to-end tests','LLM evaluation datasets','Answer relevance, correctness and groundedness','RAG retrieval and answer evaluation','Speech recognition and pronunciation evaluation','Regression testing and human feedback']},
      {title:'AI Security and Responsible AI',topics:['Prompt injection and data leakage','API key and secret management','Personal data and privacy controls','Content moderation and abuse prevention','Bias, fairness and accessibility','Usage limits, permissions and audit logs']}
    ]},
    {id:'deploy',title:'Deployment and MLOps / LLMOps',sections:[
      {title:'Deployment',topics:['Docker and containerization','Cloud deployment fundamentals','CI/CD pipelines','Environment variables and configuration','Database migrations and backups','Production health checks']},
      {title:'Monitoring and Optimization',topics:['Latency, throughput and reliability','Token usage and cost monitoring','Model and prompt versioning','Tracing and observability','Caching and batching','Model drift and feedback loops']}
    ]},
    {id:'advancedeng',title:'Advanced AI Engineering',sections:[
      {title:'Production AI Systems',topics:['Scalable inference architecture','GPU inference and serving','Quantized models and local inference','Multi-model routing','Reliability, fallback and graceful failure']},
      {title:'Advanced Specializations',topics:['Speech AI and real-time voice systems','Computer vision applications','Agentic workflows','Advanced RAG and multimodal search','Model evaluation and experimentation']}
    ]},
    {id:'p6project',title:'Phase 6 Project',sections:[{title:'Full AI Application',topics:['Login and secure user access','Database and conversation history','AI API integration and evaluation','Deployment and monitoring']} ]}
  ]},
  {id:'p7',title:'Phase 7 — Advanced Specialization and Capstone',duration:'Capstone phase',description:'Research, specialization and a complete portfolio-quality AI application.',groups:[
    {id:'research',title:'AI Research and Advanced Concepts',sections:[
      {title:'Research Skills',topics:['Reading research papers','ArXiv papers and technical documentation','Baselines, experiments and ablation studies','Benchmark comparison','Reproducible experiments']},
      {title:'Specialized AI',topics:['Reinforcement learning and RLHF concepts','Diffusion models','Vision-language models','Speech recognition and speech synthesis','Open-source LLMs and local inference','Distributed training — advanced overview']}
    ]},
    {id:'capstone',title:'Final Capstone Project — LinguaPro AI Speaking Coach',sections:[
      {title:'Core Features',topics:['Real-time AI conversation','Speech-to-text transcription','Grammar and sentence correction','Pronunciation and fluency feedback','Conversation history storage','Personalized revision based on past mistakes']},
      {title:'Intelligent Learning',topics:['User-specific learning memory','Daily, weekly and monthly reports','Previous vs current speaking comparison','AI-generated practice questions','Progress dashboard and XP system','AI response quality evaluation']},
      {title:'Production Release',topics:['Frontend and backend integration','Database schema and API security','Automated testing','Deployment and monitoring','Cost and latency optimization','Project documentation and portfolio demonstration']}
    ]}
  ]}
];

export const flattenTopics = () => AI_PHASES.flatMap(phase => phase.groups.flatMap(group => group.sections.flatMap(section =>
  section.topics.map((title, index) => ({ id: [phase.id,group.id,section.title.toLowerCase().replace(/[^a-z0-9]+/g,'-'),index].join('-'), phaseId:phase.id, phaseTitle:phase.title, groupId:group.id, groupTitle:group.title, sectionTitle:section.title, title, position:index+1 }))
)));
