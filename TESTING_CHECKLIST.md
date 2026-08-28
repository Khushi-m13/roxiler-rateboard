# RateBoard — Evaluation Testing Checklist

## Demo accounts

Password for all seeded accounts: `Password@1`

- Administrator: `admin@rateboard.example.com`
- Normal User: `aarav@example.com`
- Normal User: `meera@example.com`
- Store Owner: `owner1@example.com`
- Store Owner: `owner2@example.com`

## Role routing

- [ ] Admin login opens `/admin` and shows dashboard counts.
- [ ] Normal User login opens `/stores` and shows store cards.
- [ ] Store Owner login opens `/owner` and shows the owner dashboard.
- [ ] A role cannot open another role's protected route.

## Administrator

- [ ] Dashboard shows total users, stores and submitted ratings.
- [ ] Users can be filtered by name, email, address and role.
- [ ] Users and stores can be sorted ascending/descending.
- [ ] User details show owner average rating when the selected user is a Store Owner.
- [ ] Add User accepts Admin, Normal User and Store Owner roles.
- [ ] Add Store can assign an existing Store Owner.

## Normal User

- [ ] Registration validates name, email, address and password.
- [ ] Store search works by name and address.
- [ ] Overall rating and the user's own rating are displayed separately.
- [ ] A user can submit a 1–5 rating.
- [ ] A user can update their own existing rating.
- [ ] A user cannot update another user's rating through the API.

## Store Owner

- [ ] Owner sees only the assigned store.
- [ ] Average rating is shown.
- [ ] Rating activity shows users, email, rating and date.
- [ ] Owner cannot access admin APIs.

## Security / validation

- [ ] Passwords are stored as bcrypt hashes, never plaintext.
- [ ] JWT is required for protected API routes.
- [ ] Backend role authorization is enforced independently of React routing.
- [ ] Rating values outside 1–5 are rejected by the API.
- [ ] Duplicate `(user_id, store_id)` ratings are prevented.
- [ ] SQL queries use parameters; dynamic sort fields use allowlists.
