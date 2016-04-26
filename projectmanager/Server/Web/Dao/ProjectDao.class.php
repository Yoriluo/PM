<?php

class ProjectDao
{

	/**
	 * 从数据库查找是否存在相同的邀请码
	 */
	public function checkInviteNumber(&$inviteNumber)
	{
		$db = getDatabase();
		$result = $db -> prepareExecute('SELECT tb_project.inviteNumber FROM tb_project WHERE tb_project.inviteNumber = ?;', array($inviteNumber));
		if ($result)
		{
			return TRUE;
		}
		else
		{
			return FALSE;
		}
	}

	/**
	 * 把新项目信息写入数据库
	 */
	public function addProject(&$projectName, &$inviteNumber, &$userId)
	{
		$db = getDatabase();

		$db -> prepareExecute('INSERT INTO tb_project(tb_project.projectName,tb_project.inviteNumber,tb_project.status,tb_project.createTime)VALUES(?,?,?,?);', array($projectName, $inviteNumber, 0, date('Y-m-d H:i:s', time())));

		//获取新建项目id
		$projectId = $db -> getLastInsertID();

		$db -> prepareExecute('INSERT INTO tb_projectmember(tb_projectmember.projectId,tb_projectmember.userId,tb_projectmember.status,tb_projectmember.userType) VALUES (?,?,?,?);', array($projectId, $userId, 1, 0));

		//判断是否插入数据库成功
		if ($db -> getAffectRow() > 0)
			return $projectId;
		else
			return FALSE;
	}

	/**
	 * 从数据库获取自己创建的项目列表
	 */
	public function getMyProjectList(&$userId)
	{
		$db = getDatabase();
		$result = $db -> prepareExecuteAll('SELECT tb_project.projectId, tb_project.projectName, tb_project.status, tb_project.createTime, tb_projectmember.userType FROM tb_project INNER JOIN tb_projectmember ON tb_project.projectId = tb_projectmember.projectId WHERE tb_projectmember.userId = ? AND tb_projectmember.userType = ?;', array($userId, 0));
		//判断是否获取到
		if ($result)
			return $result;
		else
			return FALSE;
	}

	/**
	 * 从数据库获取自己参与过的项目列表
	 */
	public function getPartProjectList(&$userId)
	{
		$db = getDatabase();
		$result = $db -> prepareExecuteAll('SELECT tb_project.projectId, tb_project.projectName, tb_project.status, tb_project.createTime, tb_projectmember.userType FROM tb_project INNER JOIN tb_projectmember ON tb_project.projectId = tb_projectmember.projectId INNER JOIN tb_user ON tb_projectmember.userId = tb_user.userId WHERE tb_projectmember.userId = ? AND tb_projectmember.status = ? AND tb_projectmember.userType = ?;', array($userId, 1, 1));
		//判断是否获取到
		if ($result)
			return $result;
		else
			return FALSE;
	}

	/**
	 * 从数据库获取这个项目的详情
	 */
	public function getProjectInfo(&$projectId)
	{
		$db = getDatabase();
		$project = $db -> prepareExecuteALL('SELECT tb_project.projectName, tb_project.inviteNumber, tb_project.createTime FROM tb_project WHERE tb_project.projectId = ?;', array($projectId));
		$task = $db -> prepareExecuteALL('SELECT tb_stage.stageName, tb_task.taskId, tb_task.taskName, tb_task.status, tb_task.taskBegin, tb_task.taskEnd, tb_user.userId, tb_user.userName  FROM tb_stage INNER JOIN tb_task ON tb_stage.stageId = tb_task.stageId LEFT JOIN tb_taskmember ON tb_task.taskId = tb_taskmember.taskId LEFT JOIN tb_user ON tb_taskmember.userId = tb_user.userId WHERE tb_stage.projectId = ? ORDER BY tb_stage.stageId ASC, tb_task.taskId ASC, tb_task.taskBegin ASC;', array($projectId));
		$result = array('project' => $project, 'task' => $task);
		//判断是否获取成功
		if ($result)
			return $result;
		else
			return FALSE;

	}

	public function getProjectId(&$inviteNumber)
	{

		$db = getDatabase();
		$db -> prepareExecute('SELECT tb_project.projectId FROM tb_project INNER JOIN tb_projectmember ON tb_project.projectId = tb_projectmember.projectId WHERE tb_project.inviteNumber = ? AND tb_projectmember.userId = ?;', array($inviteNumber, $_SESSION['userId']));

		//已存在则返回
		if ($db -> getAffectRow() > 0)
			return FALSE;

		$result = $db -> prepareExecute('SELECT tb_project.projectId, tb_project.projectName, tb_projectmember.userId FROM tb_project INNER JOIN tb_projectmember ON tb_project.projectId = tb_projectmember.projectId WHERE tb_project.inviteNumber = ? AND tb_projectmember.userType = ?;', array($inviteNumber, 0));
		if ($result)
			return $result;
		else
			return FALSE;

	}

	public function getProjectInfoByTime(&$projectId)
	{
		$db = getDatabase();
		$project = $db -> prepareExecuteALL('SELECT tb_project.projectName, tb_project.inviteNumber, tb_project.createTime FROM tb_project WHERE tb_project.projectId = ?;', array($projectId));
		$task = $db -> prepareExecuteALL('SELECT tb_stage.stageName, tb_task.taskId, tb_task.taskName, tb_task.status, tb_task.taskBegin, tb_task.taskEnd, tb_user.userId, tb_user.userName  FROM tb_stage INNER JOIN tb_task ON tb_stage.stageId = tb_task.stageId LEFT JOIN tb_taskmember ON tb_task.taskId = tb_taskmember.taskId LEFT JOIN tb_user ON tb_taskmember.userId = tb_user.userId WHERE tb_stage.projectId = ? ORDER BY tb_task.taskBegin ASC;', array($projectId));
		$result = array('project' => $project, 'task' => $task);
		//判断是否获取成功
		if ($result)
			return $result;
		else
			return FALSE;

	}

	/**
	 * 申请加入项目，把相关信息写入数据库
	 */
	public function joinProject(&$projectId, &$userId, &$content, &$proposerId)
	{
		$db = getDatabase();
		$db -> prepareExecute('INSERT INTO tb_projectmember(tb_projectmember.projectId,tb_projectmember.userId,tb_projectmember.status,tb_projectmember.userType) VALUES(?,?,?,?);', array($projectId, $proposerId, 0, 1));

		//判断是否申请成功
		if ($db -> getAffectRow() <= 0)
			//申请失败，则返回
			return FALSE;
		//申请成功，则把消息写入数据库发给对方
		$db -> prepareExecute('INSERT INTO tb_news(tb_news.content,tb_news.status,tb_news.flag,tb_news.createTime,tb_news.ownId,tb_news.projectId,tb_news.proposerId)VALUES(?,?,?,?,?,?,?);', array($content, 0, 0, date('Y-m-d H:i:s', time()), $userId, $projectId, $proposerId));
		//是否成功插入消息
		if ($db -> getAffectRow() > 0)
			return TRUE;
		else
			return FALSE;
	}

	/**
	 * 从数据库获取这个项目的成员列表
	 */
	public function getPartnerList(&$projectId)
	{
		$db = getDatabase();
		$result = $db -> prepareExecuteALL('SELECT tb_user.userName,tb_user.userId FROM tb_user INNER JOIN tb_projectmember ON tb_user.userId = tb_projectmember.userId WHERE tb_projectmember.projectId = ? AND tb_projectmember.status = ?', array($projectId, 1));
		//判断是否获取成功
		if ($result)
			return $result;
		else
			return FALSE;
	}

	/**
	 * 更改项目状态为完成状态
	 */
	public function finishProject(&$projectId)
	{
		$db = getDatabase();
		$result = $db -> prepareExecute('SELECT tb_task.taskId FROM tb_project INNER JOIN tb_stage ON tb_project.projectId = tb_stage.projectId INNER JOIN tb_task ON tb_stage.stageId = tb_task.stageId WHERE tb_project.projectId = ?;', array($projectId));
		$db -> prepareExecute('SELECT tb_project.projectId FROM tb_project INNER JOIN tb_stage ON tb_project.projectId = tb_stage.projectId INNER JOIN tb_task ON tb_stage.stageId = tb_task.stageId WHERE tb_project.projectId = ? AND tb_task.status = ?;', array($projectId, 0));
		//判断是否还有任务是否完成
		if ($db -> getAffectRow() > 0 || !$result)
			//还有任务为完成，返回
			return FALSE;
		//任务已经全部完成，可以完成项目
		else
		{
			$db -> prepareExecute('UPDATE tb_project SET tb_project.status = ? WHERE tb_project.projectId = ?;', array(1, $projectId));
			//判断是否成功更新项目状态为完成状态
			if ($db -> getAffectRow() > 0)
				return TRUE;
			else
				return FALSE;
		}

	}

}
