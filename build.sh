pm2 stop $2
rm -rf console


git clone https://amezng:${GH_TOKEN}@github.com/torqbit/console.git
cd console
git fetch --all
git checkout $1

touch .env

cat <<EOF >> .env
GITHUB_ID=$GITHUB_ID
GITHUB_SECRET=$GITHUB_SECRET
NEXT_PUBLIC_EMAIL_ADDRESS=$NEXT_PUBLIC_EMAIL_ADDRESS
NEXT_PUBLIC_PASSWORD=$NEXT_PUBLIC_PASSWORD
FROM_USER_EMAIL=$FROM_USER_EMAIL
TO_USER_EMAIL=
DATABASE_URL=$DATABASE_URL
NEXT_PUBLIC_SECRET=$NEXT_PUBLIC_SECRET
NEXTAUTH_URL=$NEXTAUTH_URL
NEXT_PUBLIC_APP_ENV=$NEXT_PUBLIC_APP_ENV
GOOGLE_ID=$GOOGLE_ID
GOOGLE_SECRET=$GOOGLE_SECRET
IKIT_PUBLIC_KEY=$IKIT_PUBLIC_KEY
IKIT_PRIVATE_KEY=$IKIT_PRIVATE_KEY
IKIT_URL_ENDPOINT=$IKIT_URL_ENDPOINT
IKIT_AUTH_ENDPOINT=$IKIT_AUTH_ENDPOINT
PDF_DIRECTORY=$PDF_DIRECTORY

EOF
yarn install
npx prisma generate
npx prisma db push
yarn build
cp -R .next/static/ /var/www/console/.next
pm2 start torqbit-dev

