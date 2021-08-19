export default () => ({
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
  jwt: {
	secret: process.env.JWT_SECRET,
	},
	ft: {
		id: process.env.FT_CLIENT_ID,
		secret: process.env.FT_CLIENT_SECRET,
		callback: process.env.FT_CLIENT_CALLBACK,
	},
});
