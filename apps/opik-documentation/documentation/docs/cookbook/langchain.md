# Using Opik with Langchain

For this guide, we will be performing a text to sql query generation task using LangChain. We will be using the Chinook database which contains the SQLite database of a music store with both employee, customer and invoice data.

We will highlight three different parts of the workflow:

1. Creating a synthetic dataset of questions
2. Creating a LangChain chain to generate SQL queries
3. Automating the evaluation of the SQL queries on the synthetic dataset

## Creating an account on Comet.com

[Comet](https://www.comet.com/site) provides a hosted version of the Opik platform, [simply create an account](https://www.comet.com/signup?from=llm) and grab you API Key.

> You can also run the Opik platform locally, see the [installation guide](https://www.comet.com/docs/opik/self-host/self_hosting_opik) for more information.


```python
import os
import getpass

os.environ["OPIK_API_KEY"] = getpass.getpass("Opik API Key: ")
os.environ["OPIK_WORKSPACE"] = input("Comet workspace (often the same as your username): ")
```

If you are running the Opik platform locally, simply set:


```python
# import os
# os.environ["OPIK_URL_OVERRIDE"] = "http://localhost:5173/api"
```

## Preparing our environment

First, we will install the necessary libraries, download the Chinook database and set up our different API keys.


```python
%pip install --upgrade --quiet opik langchain langchain-community langchain-openai
```


```python
# Download the relevant data
import os
from langchain_community.utilities import SQLDatabase

import requests
import os

url = "https://github.com/lerocha/chinook-database/raw/master/ChinookDatabase/DataSources/Chinook_Sqlite.sqlite"
filename = "./data/chinook/Chinook_Sqlite.sqlite"

folder = os.path.dirname(filename)

if not os.path.exists(folder):
    os.makedirs(folder)

if not os.path.exists(filename):
    response = requests.get(url)
    with open(filename, 'wb') as file:
        file.write(response.content)
    print(f"Chinook database downloaded")
    
db = SQLDatabase.from_uri(f"sqlite:///{filename}")
```


```python
import os
import getpass
os.environ["OPENAI_API_KEY"] = getpass.getpass("OpenAI API Key: ")
```

## Creating a synthetic dataset

In order to create our synthetic dataset, we will be using the OpenAI API to generate 20 different questions that a user might ask based on the Chinook database.

In order to ensure that the OpenAI API calls are being tracked, we will be using the `track_openai` function from the `opik` library.


```python
from opik.integrations.openai import track_openai
from openai import OpenAI
import json

os.environ["OPIK_PROJECT_NAME"] = "langchain-integration-demo"
client = OpenAI()

openai_client = track_openai(client)

prompt = """
Create 20 different example questions a user might ask based on the Chinook Database.

These questions should be complex and require the model to think. They should include complex joins and window functions to answer.

Return the response as a json object with a "result" key and an array of strings with the question.
"""

completion = openai_client.chat.completions.create(
  model="gpt-3.5-turbo",
  messages=[
    {"role": "user", "content": prompt}
  ]
)

print(completion.choices[0].message.content)
```

Now that we have our synthetic dataset, we can create a dataset in Comet and insert the questions into it.


```python
# Create the synthetic dataset
from opik import Opik
from opik import DatasetItem

synthetic_questions = json.loads(completion.choices[0].message.content)["result"]

client = Opik()
try:
    dataset = client.create_dataset(name="synthetic_questions")
    dataset.insert([
        DatasetItem(input={"question": question}) for question in synthetic_questions
    ])
except Exception as e:
    pass
```

## Creating a LangChain chain

We will be using the `create_sql_query_chain` function from the `langchain` library to create a SQL query to answer the question.

We will be using the `OpikTracer` class from the `opik` library to ensure that the LangChan trace are being tracked in Comet.


```python
# Use langchain to create a SQL query to answer the question
from langchain.chains import create_sql_query_chain
from langchain_openai import ChatOpenAI
from opik.integrations.langchain import OpikTracer

opik_tracer = OpikTracer(tags=["simple_chain"])

llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)
chain = create_sql_query_chain(llm, db).with_config({"callbacks": [opik_tracer]})
response = chain.invoke({"question": "How many employees are there ?"})
response

print(response)
```

## Automatting the evaluation

In order to ensure our LLM application is working correctly, we will test it on our synthetic dataset.

For this we will be using the `evaluate` function from the `opik` library. We will evaluate the application using a custom metric that checks if the SQL query is valid.


```python
from opik import Opik, track
from opik.evaluation import evaluate
from opik.evaluation.metrics import base_metric, score_result
from typing import Any

class ValidSQLQuery(base_metric.BaseMetric):
    def __init__(self, name: str, db: Any):
        self.name = name
        self.db = db

    def score(self, output: str, **ignored_kwargs: Any):
        # Add you logic here

        try:
            db.run(output)
            return score_result.ScoreResult(
                name=self.name,
                value=1,
                reason="Query ran successfully"
            )
        except Exception as e:
            return score_result.ScoreResult(
                name=self.name,
                value=0,
                reason=str(e)
            )

valid_sql_query = ValidSQLQuery(name="valid_sql_query", db=db)

client = Opik()
dataset = client.get_dataset("synthetic_questions")

@track()
def llm_chain(input: str) -> str:
    response = chain.invoke({"question": input})
    
    return response

def evaluation_task(item):
    response = llm_chain(item.input["question"])

    return {
        "reference": "hello",
        "output": response
    }

res = evaluate(
    experiment_name="SQL question answering",
    dataset=dataset,
    task=evaluation_task,
    scoring_metrics=[valid_sql_query]
)
```

The evaluation results are now uploaded to the Opik platform and can be viewed in the UI.

![LangChain Evaluation](/img/cookbook/langchain_cookbook.png)

