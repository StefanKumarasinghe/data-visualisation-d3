import pandas as pd


df = pd.read_csv("expectancy_raw.csv")

# Filter the data for the variable "Total population at birth"
filtered_df = df[df["Variable"] == "Total population at birth"]

# Select only the "Year", "Country", and "Value" columns
filtered_df = filtered_df[["Year", "Country", "Value"]]


filtered_df.to_csv("filtered_expectancy.csv", index=False)
