<?php
class UserDao
{
	/**
	 * 根据手机号码查看用户信息
	 */
	public function getUserLoginInfo(&$userPhoneNumber)
	{
		$db = getDatabase();

		$result = $db -> prepareExecute('SELECT tb_user.userId,tb_user.userPassword,tb_user.userToken,tb_user.userName FROM tb_user WHERE tb_user.userPhoneNumber = ?', array($userPhoneNumber));

		//判断是否查询成功
		if ($db -> getAffectRow() > 0)
			//查询成功，返回用户信息
			return $result;
		else
			//查询失败
			return FALSE;
	}
	
	/**
	 * 根据用户id查找用户信息
	 */
	public function getUserLoginInfoById(&$userId)
	{
		$db = getDatabase();

		$result = $db -> prepareExecute('SELECT tb_user.userPassword FROM tb_user WHERE tb_user.userId = ?', array($userId));

		$result = array('userPassword' => $result['userPassword']);
		
		//判断是否查询成功
		if ($db -> getAffectRow() > 0)
			//查询成功，返回用户信息
			return $result;
		else
			//查询失败
			return FALSE;
	}

	/**
	 * 更新数据库中的用户登录信息
	 */
	public function updateUserLoginInfo(&$userPhoneNumber, &$userToken, &$loginTimeStamp)
	{
		$db = getDatabase();
		$db -> prepareExecute('UPDATE tb_user SET tb_user.userToken = ?,tb_user.userLastLoginTimeStamp = ? WHERE tb_user.userPhoneNumber = ?', array($userToken, date('Y-m-d H:i:s', $loginTimeStamp), $userPhoneNumber));

		//判断是否更新成功
		if ($db -> getAffectRow() > 0)
			//更新成功
			return TRUE;
		else
			//更新失败
			return FALSE;
	}

	/**
	 * 用户注册，把用户信息插入数据库
	 */
	public function register(&$userName, &$hashPassword, &$userPhoneNumber)
	{
		$db = getDatabase();

		//判断是否已存在用户
		$result = $db -> prepareExecute('SELECT tb_user.userId FROM tb_user WHERE tb_user.userPhoneNumber=?;', array($userPhoneNumber));

		//已存在则返回
		if ($db -> getAffectRow() > 0)
			return FALSE;

		//若不存在则插入
		$db -> prepareExecute('INSERT INTO tb_user (tb_user.userName,tb_user.userPassword,tb_user.userPhoneNumber) VALUES (?,?,?);', array($userName, $hashPassword, $userPhoneNumber));

		//判断是否插入成功
		if ($db -> getAffectRow() > 0)
			//插入成功
			return TRUE;
		else
			//插入失败
			return FALSE;
	}

	/**
	 * 修改密码
	 */
	public function updatePassword(&$newPassword)
	{
		$db = getDatabase();
		
		$db -> prepareExecute('UPDATE tb_user SET tb_user.userPassword = ? WHERE tb_user.userId = ?', array($newPassword, $_SESSION['userId']));
		
		//判断是否修改密码成功
		if ($db -> getAffectRow() > 0)
			//修改密码成功
			return TRUE;
		else
			//修改密码失败
			return FALSE;
	}

}
?>