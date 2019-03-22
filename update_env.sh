cp serverless.example.env.json serverless.env.json

sed -i.bak 's|$DEV_ENVIRONMENT|'"$DEV_ENVIRONMENT"'|g' serverless.env.json
sed -i.bak 's|$DEV_BUGSNAG_API_KEY|'"$DEV_BUGSNAG_API_KEY"'|g' serverless.env.json

sed -i.bak 's|$PROD_ENVIRONMENT|'"$PROD_ENVIRONMENT"'|g' serverless.env.json
sed -i.bak 's|$PROD_BUGSNAG_API_KEY|'"$PROD_BUGSNAG_API_KEY"'|g' serverless.env.json

cat serverless.env.json
