export function postData(url, values, actions, toast, onSuccess) {
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
    })
        .then(response => response.json())
        .then(data => {
            if (data['status'] === 'success') {
                onSuccess()
            }
            toast({
                title: data['response'],
                status: data['status'],
                isClosable: true,
            })
        })
        .catch((error) => {
            toast({
                title: error.message,
                status: 'error',
                isClosable: true,
            })
        })
        .finally(() => {
            actions.setSubmitting(false);
        });
}

export function getData(url, toast, onSuccess, onError) {
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {
            if (data['status'] === 'success') {
                onSuccess(data['response'])
                return;
            }
            toast({
                title: data['response'],
                status: data['status'],
                isClosable: true,
            })
            if (typeof onError !== 'undefined')
                onError(data['response'])
        })
        .catch((error) => {
            toast({
                title: error.message,
                status: 'error',
                isClosable: true,
            })
            if (typeof onError !== 'undefined')
                onError(error.message)
        })
}

export function validate(field_name, value) {
    let error;

    if (!value) {
        error = field_name + ' is required'
    }
    return error
}

export function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}