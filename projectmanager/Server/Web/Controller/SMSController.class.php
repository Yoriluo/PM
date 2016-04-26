<?php
class SMSController
{
	//返回json类型
	private $returnJson = array('type' => 'sms');
	
	/**
	 * 获取注册验证码
	 */
	public function getRegisterCheckCode()
	{
		$userPhoneNumber = quickInput('userPhoneNumber');

		//验证手机号码格式
		if (!preg_match('/^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/', $userPhoneNumber))
		{
			//手机号非法
			$this -> returnJson['statusCode'] = '150001';
		}
		else
		{
			//手机号正确
			$service = new SMSModule();
			$this -> returnJson['statusCode'] = $service -> getRegisterCheckCode($userPhoneNumber);
		}
		exit(json_encode($this -> returnJson));
	}

}
?>