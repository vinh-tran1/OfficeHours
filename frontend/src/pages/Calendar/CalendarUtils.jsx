const EVENT_API_URL = process.env.REACT_APP_API_URL_LOCAL + "/api/class/";
const TAS_API_URL = process.env.REACT_APP_API_URL_LOCAL + "/api/class/";

export async function getClassEvents(class_id, toast) {
    const response = await fetch(EVENT_API_URL + class_id + "/events")

    if (!response.ok) {
        toast({
            title: response.status,
            status: 'error',
            isClosable: true,
        })
    }

    const events = await response.json()
    return events['response']
}

export async function getClassTAs(class_id, toast) {
    const response = await fetch(TAS_API_URL + class_id + "/tas")

    if (!response.ok) {
        toast({
            title: response.status,
            status: 'error',
            isClosable: true,
        })
    }

    const tasData = await response.json();
    return tasData.tas;
}