<?php
class ProjectModule
{
	/**
	 * 新建项目
	 */
	public function addProject(&$projectName)
	{
		$userId = $_SESSION['userId'];
		$arr = array('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9');
		$arrLen = count($arr) - 1;
		$inviteNumber = "";
		//随机生成六位邀请码
		for($i=0;$i<6;$i++)
		{
			$inviteNumber .=$arr[mt_rand(0, 36)];
		}
		$dao = new ProjectDao;
		//验证邀请码是否存在
		if($dao->checkInviteNumber($inviteNumber))
		{
			//邀请码存在返回false
			return FALSE;
		}
		else
		{
			//邀请码不存在则创建项目
			return $dao->addProject($projectName, $inviteNumber, $userId);
		}
	}

	/**
	 * 获取自己的项目
	 */
	public function getMyProjectList()
	{
		$dao = new ProjectDao;
		return $dao -> getMyProjectList($_SESSION['userId']);
	}

	/**
	 * 获取参与的项目
	 */
	public function getPartProjectList()
	{
		$dao = new ProjectDao;
		return $dao -> getPartProjectList($_SESSION['userId']);
	}

	/**
	 * 根据项目Id获取项目详情
	 */
	public function getProjectInfo(&$projectId)
	{
		$dao = new ProjectDao;
		return $dao -> getProjectInfo($projectId);
	}

	public function getProjectInfoByTime(&$projectId)
	{
		$dao = new ProjectDao;
		return $dao -> getProjectInfoByTime($projectId);
	}

	/**
	 * 申请加入项目
	 */
	public function joinProject(&$inviteNumber)
	{
		$dao = new ProjectDao;
		//验证邀请码是否正确
		$result = $dao -> getProjectId($inviteNumber);
		if ($result)
		{
			//验证码正确
			$content = $_SESSION['userName'] . '申请加入' . $result['projectName'] . '项目';
			return $dao -> joinProject($result['projectId'], $result['userId'], $content, $_SESSION['userId']);
		}
		else
		{
			//验证码错误
			return FALSE;
		}
	}

	/**
	 * 获取项目所有成员
	 */
	public function getPartnerList(&$projectId)
	{
		$dao = new ProjectDao;
		return $dao -> getPartnerList($projectId);
	}

	/**
	 * 完成项目
	 */
	public function finishProject(&$projectId)
	{
		$dao = new ProjectDao;
		return $dao -> finishProject($projectId);
	}

}
