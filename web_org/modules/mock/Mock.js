function mockLogin(){
	Mock.mock('/action/login', 'post', function(opts){
		return ' var leftPwdNums = 0; var time = 0; var overtime = 5000';
	});
}
function mockAll(){
	mockLogin();
}
mockAll();
	