import { libcamera } from 'libcamera';
const capture = async (name ='test.jpeg') => { 
    const resp = await libcamera.jpeg({
        config: {
            output: name
        }
    })
    console.log(resp)
    return resp;
}

export default capture;