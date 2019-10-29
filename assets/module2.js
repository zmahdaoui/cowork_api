exports.success = function success(result){
	return {
		status :1,
		result:result
	}
}

exports.error=function error(message){
	return {
		status :0,
		message:message
	}
}

exports.isErr = (err) => {
	return err instanceof Error;
}

exports.checkAndChange = (object) => {
	if(this.isErr(object))
		return this.error(object.message)
	else
		return this.success(object)
}

