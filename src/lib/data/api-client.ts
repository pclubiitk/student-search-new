import { Student } from "@/lib/types/data";

const config = {
    APP_ID: "data-rgzxa",
    API_KEY: "rQGiNUs2keKQNThu0QW54y1VMQ6JmcpNBPI5gzag9gEjfqit5WvXa97plKOknpRU",
    cluster_name: "Cluster0",
    db_name: "student_search",
    collection_name: "student_search"
} as const;

async function fetch_student_data(): Promise<Student[]> {
	console.log("Sending access token request...");
	const authResponse = await fetch(`https://ap-south-1.aws.realm.mongodb.com/api/client/v2.0/app/${config.APP_ID}/auth/providers/api-key/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			"key": config.API_KEY
		})
    }).then(res => res.json()).catch(err => {
    	throw err;
    });
    
    const access_token = authResponse.access_token;
    console.log(`Access token:`);
    console.log(access_token);
    if (access_token === undefined) {
    	throw new Error("Access token undefined");
    }
    
    const dataResponse = await fetch(`https://ap-south-1.aws.data.mongodb-api.com/app/${config.APP_ID}/endpoint/data/v1/action/find`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
        },
        body: JSON.stringify({
            dataSource: config.cluster_name,
            database: config.db_name,
            collection: config.collection_name,
            filter: {},
            limit: 30000
        })
	}).then(res => res.json());
	
	const student_data = dataResponse.documents;
	if (!Array.isArray(student_data)) {
		throw new Error("Student data undefined");
	}
 	return student_data as Student[];
}

export { fetch_student_data };
