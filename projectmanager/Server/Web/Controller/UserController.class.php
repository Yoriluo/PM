<?php
class UserController
{
	//返回json类型
	private $returnJson = array('type' => 'user');
	
	/**
	 * 注册
	 */
	public function register()
	{
		$userPhoneNumber = quickInput('userPhoneNumber');
		$checkCode = quickInput('checkCode');
		$userPassword = quickInput('userPassword');
		$rePassword = quickInput('rePassword');
		$userName = quickInput('userName');
		$nameLen = strlen($userName);
		session_start();
		//验证手机号码格式
		if (!preg_match('/^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/', $userPhoneNumber))
		{
			//手机号非法
			$this -> returnJson['statusCode'] = '160001';
		}
		//验证密码格式是否合法
		else if (!preg_match('/^[0-9a-zA-Z~`!@#$%^&*()-=_+\[\]{};:\'"\\|,<.>\/\?]{6,16}$/', $userPassword))
		{
			//密码非法
			$this -> returnJson['statusCode'] = '160002';
		}
		//验证验证码是否正确
		// else if (session_status() != PHP_SESSION_ACTIVE || !preg_match('/^[121212-989898]{6}$/', $checkCode) || $_SESSION['registerCheckCode'] != $checkCode || time() - $_SESSION['checkCodeCreateTime'] > 300)
		// {
		// 	//未获取验证码、验证码非数字组合、验证码不正确或者验证码已过期(300s)
		// 	$this -> returnJson['statusCode'] = '160003';
		// }
		//验证两次输入密码是否一致
		else if ($userPassword != $rePassword)
		{
			//两次输入密码不一致
			$this -> returnJson['statusCode'] = '160004';
		}
		//验证用户格式是否合法
		else if ($nameLen < 2 || $nameLen > 20)
		{
			//用户名格式非法
			$this -> returnJson['statusCode'] = '160005';
		}
		else
		{
			$server = new UserModule;
			//验证是否注册成功
			if ($server -> register($userName, $userPassword, $userPhoneNumber))
				//注册成功
				$this -> returnJson['statusCode'] = '000000';
			else
				//注册失败
				$this -> returnJson['statusCode'] = '160006';
		}
		exit(json_encode($this -> returnJson));
	}
	

	/**
	 * 登录
	 */
	public function login()
	{
		$userPhoneNumber = quickInput('userPhoneNumber');
		$userPassword = quickInput('userPassword');
		//验证手机号码格式
		if (!preg_match('/^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/', $userPhoneNumber))
		{
			//手机号非法
			$this -> returnJson['statusCode'] = '170001';
		}
		//验证密码格式是否合法
		elseif (!preg_match('/^[0-9a-zA-Z~`!@#$%^&*()-=_+\[\]{};:\'"\\|,<.>\/\?]{6,16}$/', $userPassword))
		{
			//密码格式非法
			$this -> returnJson['statusCode'] = '170002';
		}
		else
		{
			$server = new UserModule;
			//验证登陆是否成功
			if ($server -> login($userPhoneNumber, $userPassword))
			{
				//登陆成功
				$this -> returnJson['statusCode'] = '000000';
				$this -> returnJson['userId'] = $_SESSION['userId'];
				$this -> returnJson['userName'] = $_SESSION['userName'];
				$this -> returnJson['userToken'] = $_SESSION['userToken'];
			}
			else
			{
				//登陆失败，用户不存在或者密码错误
				$this -> returnJson['statusCode'] = '170003';	
			}
		}
		exit(json_encode($this -> returnJson));
	}

	
	/**
	 * 修改密码
	 */
	public function updatePassword()
	{
		//检查用户登陆状态
		UserController::checkLogin();
		if ($this -> returnJson['statusCode'] == '000000')
		{
			//用户已经登陆
			$userPassword = quickInput('userPassword');
			$newPassword1 = quickInput('newPassword1');
			$newPassword2 = quickInput('newPassword2');
			//验证密码格式是否合法
			if (!preg_match('/^[0-9a-zA-Z~`!@#$%^&*()-=_+\[\]{};:\'"\\|,<.>\/\?]{6,16}$/', $userPassword) || !preg_match('/^[0-9a-zA-Z~`!@#$%^&*()-=_+\[\]{};:\'"\\|,<.>\/\?]{6,16}$/', $newPassword1) || !preg_match('/^[0-9a-zA-Z~`!@#$%^&*()-=_+\[\]{};:\'"\\|,<.>\/\?]{6,16}$/', $newPassword2))
			{
				//密码格式不合法
				$this -> returnJson['statusCode'] = '180001';
			}
			//验证两次输入密码是否一致
			else if ($newPassword1 != $newPassword2)
			{
				//两次输入密码不一致
				$this -> returnJson['statusCode'] = '180002';
			}
			else
			{
				$service = new UserModule();
				//是否修改密码成功
				if ($service -> updatePassword($userPassword, $newPassword1))
					//修改密码成功
					$this -> returnJson['statusCode'] = '000000';
				else
					//修改密码失败
					$this -> returnJson['statusCode'] = '180003';
			}
		}
		exit(json_encode($this -> returnJson));
	}

	/**
	 * 忘记密码时，修改密码
	 */
	public function setNewPassword()
	{
		UserController::checkLogin();
		//检查用户登陆状态
		if ($this -> returnJson['statusCode'] == '000000')
		{
			$checkCode = quickInput('checkCode');
			$newPassword1 = quickInput('newPassword1');
			$newPassword2 = quickInput('newPassword2');
			//验证验证码是否正确
			if (session_status() != PHP_SESSION_ACTIVE || !preg_match('/^[121212-989898]{6}$/', $checkCode) || $_SESSION['registerCheckCode'] != $checkCode || time() - $_SESSION['checkCodeCreateTime'] > 300)
			{
				//未获取验证码、验证码非数字组合、验证码不正确或者验证码已过期(300s)
				$this -> returnJson['statusCode'] = '19001';
			}
			//验证码密码格式是否合法
			else if (!preg_match('/^[0-9a-zA-Z~`!@#$%^&*()-=_+\[\]{};:\'"\\|,<.>\/\?]{6,16}$/', $newPassword1) || !preg_match('/^[0-9a-zA-Z~`!@#$%^&*()-=_+\[\]{};:\'"\\|,<.>\/\?]{6,16}$/', $newPassword2))
			{
				//密码格式非法
				$this -> returnJson['statusCode'] = '190002';
			}
			//验证两次输入密码是否一致
			else if ($newPassword1 != $newPassword2)
			{
				//两次输入密码不一致
				$this -> returnJson['statusCode'] = '190003';
			}
			else
			{
				$service = new UserModule();
				//判断是否修改密码成功
				if ($service -> setNewPassword($newPassword1))
					//修改密码成功
					$this -> returnJson['statusCode'] = '000000';
				else
					//修改密码失败
					$this -> returnJson['statusCode'] = '190004';
			}
		}
		exit(json_encode($this -> returnJson));
	}

	/**
	 * 退出登录
	 */
	public function logout()
	{
		session_start();
		session_destroy();
		$this -> returnJson['statusCode'] = '000000';
		exit(json_encode($this -> returnJson));
	}

	/**
	 * 检查登录状态
	 */
	public function checkLogin()
	{
		session_start();
		//检查用户是否登陆
		if (quickInput('userToken') == $_SESSION['userToken'])
			//用户已经登陆
			$this -> returnJson['statusCode'] = '000000';
		else
			//用户没有登陆
			$this -> returnJson['statusCode'] = '000001';
	}

}
?>