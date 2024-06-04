import pandas as pd


life_expectancy_df = pd.read_csv("filtered_expectancy.csv")


health_df = pd.read_csv("HEAT.csv")


merged_df = pd.merge(life_expectancy_df, health_df, on=["Country", "Year"], how="inner")

merged_df = merged_df[["Country", "Year", "Value_x", "Value_y"]]

merged_df.rename(columns={"Value_x": "Expectancy", "Value_y": "Value"}, inplace=True)

merged_df.to_csv("combined_data.csv", index=False)
