import csv
import pandas as pd
from sklearn.linear_model import LinearRegression
import numpy as np

new_filename = "HEAT_REGRESSED.csv"

original_filename = "HEAT.csv"

df = pd.read_csv(original_filename)

grouped = df.groupby('Country')

filled_df = pd.DataFrame(columns=df.columns)

for name, group in grouped:

    years_present = set(group['Year'])
    missing_years = set(range(2010, 2023)) - years_present
    if missing_years:

        model = LinearRegression()

        non_missing_data = group.dropna(subset=['Value'])
        X = non_missing_data[['Year']]
        y = non_missing_data['Value']

        model.fit(X, y)

        X_missing = pd.DataFrame({'Year': list(missing_years)})
        y_pred = model.predict(X_missing)

        y_pred_clipped = np.clip(y_pred, None, 100)

        missing_data = pd.DataFrame({'Country': name, 'Year': X_missing['Year'], 'Value': y_pred_clipped})
        filled_df = pd.concat([filled_df, missing_data])

final_df = pd.concat([df.dropna(subset=['Value']), filled_df])

final_df.to_csv(new_filename, index=False)

print("Data filling completed. New CSV file created:", new_filename)