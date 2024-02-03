const { libcamera } = require('libcamera');
const capture = async (name = 'test.jpeg') => {
	const resp = await libcamera.jpeg({
		config: {
			output: name,
		},
	});
	console.log(resp);
	return resp;
};

capture('test.jpeg').then((resp) => {
	console.log(resp);
});

export default capture;
