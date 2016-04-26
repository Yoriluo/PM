<?php
class SMSModule
{
	public function getRegisterCheckCode(&$userPhoneNumber)
	{
		//生成验证码
		$checkCode = rand(121212, 989898);

		//判断是否恶意刷短信,间隔90s
		session_start();
		if (isset($_SESSION['checkCodeCreateTime']) && time() - $_SESSION['checkCodeCreateTime'] < 60)
			return '150002';

		//调用云之讯接口发送短信
		$options['accountsid'] = 'dd460f752f1173beab827a06bde17ee5';
		$options['token'] = '53e8acece8a25ef372130e4d71f16c27';
		$ucpass = new UcpaasModule($options);
		$appId = 'ebabd6c4f1de4360a048aea7eff6c1dd';
		$templateId = '21478';
		$param = "$checkCode,5";
		$result = json_decode($ucpass -> templateSMS($appId, $userPhoneNumber, $templateId, $param), TRUE);
		$result = $result['resp']['respCode'];
		if ($result == '000000')
		{
			//发送成功
			//写入session判断验证码超时
			$_SESSION['checkCodeCreateTime'] = time();
			$_SESSION['registerCheckCode'] = $checkCode;
			return '000000';
		}
		else if ($result == '105102' || $result == '100006')
		{
			//手机号码有误
			return '150001';
		}
		else if ($result == '100001' || $result == '105105')
		{
			//账户余额不足
			return '150003';
		}
		else if ($result == '105122')
		{
			//一天只能发送10条，运营商限制
			return '150002';
		}
		else
		{
			//其他错误，请查阅云之讯官方文档
			return $result;
		}
	}

}
?>