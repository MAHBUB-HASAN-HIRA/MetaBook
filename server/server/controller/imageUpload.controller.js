const fs = require("fs");
const imgbbUploader = require("imgbb-uploader");

const uploadImage = async (image) => {
	try {
		const imagePath = `${__dirname}/images/${
			Math.ceil(123454 * Math.random()) + "_" + image.name
		}`;
		image.mv(imagePath);
		const response = await imgbbUploader(process.env.IMGBB_API_KEY, imagePath);
		fs.unlink(imagePath, (err) => console.error(err));
		return response;
	} catch (error) {
		return { error: true, ...error };
	}
};

module.exports = { uploadImage };