<?php
class UserModule
{
	/**
	 * 注册
	 */
	public function register(&$userName, &$userPassword, &$userPhoneNumber)
	{
		$hashPassword = password_hash($userPassword, PASSWORD_BCRYPT);
		$dao = new UserDao;

		if ($dao -> register($userName, $hashPassword, $userPhoneNumber))
		{
			//先清除所有的session，因为之前储存了短信的信息，防止内存占用
			session_destroy();
			return TRUE;
		}
		else
			return FALSE;
	}

	/**
	 * 登录
	 */
	public function login(&$userPhoneNumber, &$userPassword)
	{
		$time = time();
		$userToken = password_hash($userPhoneNumber . $time, PASSWORD_BCRYPT);
		$dao = new UserDao;
		$userInfo = $dao -> getUserLoginInfo($userPhoneNumber);
		//验证密码是否正确
		if ($userInfo != FALSE && password_verify($userPassword, $userInfo['userPassword']))
		{
			//将token以及最后登录时间储存进数据库
			if ($dao -> updateUserLoginInfo($userPhoneNumber, $userToken, $time))
			{
				session_start();
				$_SESSION['userId'] = $userInfo['userId'];
				$_SESSION['userName'] = $userInfo['userName'];
				$_SESSION['userToken'] = $userToken;
				return '000000';
			}
			else
			{
				return FALSE;
			}
		}
		else
		{
			return FALSE;
		}
	}

	/**
	 * 修改密码
	 */
	public function updatePassword(&$userPassword, &$newPassword)
	{
		$hashPassword = password_hash($newPassword, PASSWORD_BCRYPT);
		$dao = new UserDao;
		$userInfo = $dao -> getUserLoginInfoById($_SESSION[userId]);
		//验证密码是否正确
		if ($userInfo != FALSE && password_verify($userPassword, $userInfo['userPassword']))
			//密码正确
			return $dao -> updatePassword($hashPassword);
		else
			//密码错误
			return FALSE;
	}

	/**
	 * 忘记密码时修改密码
	 */
	public function setNewPassword(&$newPassword)
	{
		$hashPassword = password_hash($newPassword, PASSWORD_BCRYPT);
		$dao = new UserDao;
		return $dao -> updatePassword($hashPassword);
	}

}
?>