import aw1 from '@mmstudio/aw000001';
import global from '@mmstudio/global';

export default function submit<T>(mm: aw1, selector: string, service_name: string, ext: { [key: string]: string }) {
	return new Promise<T>((resolve, reject) => {
		const url = `${global('host', '.')}/sendmessage/${encodeURIComponent(service_name)}`;
		const form = mm.data.node.querySelector<HTMLFormElement>(selector)!;
		if (form.reportValidity) {
			if (!form.reportValidity()) {
				reject(new Error('不合法的表单项!'));
				return;
			}
		} else {
			// ie11
			// eslint-disable-next-line no-lonely-if
			if (!form.checkValidity()) {
				reject(new Error('不合法的表单项!'));
				return;
			}
		}
		const form_data = new FormData(form);
		Object.keys(ext).forEach((key) => {
			const val = ext[key];
			form_data.append(key, val);
		});
		const request = new XMLHttpRequest();
		request.onload = () => {
			if (request.status === 200) {
				resolve(JSON.parse(request.responseText) as T);
			} else {
				reject(new Error(request.responseText));
			}
		};
		request.open('POST', url);
		request.send(form_data);
	});
}
