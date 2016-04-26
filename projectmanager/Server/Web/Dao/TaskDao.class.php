<?php
class TaskDao
{
	/**
	 * 新建阶段
	 */
	public function addStage(&$projectId, &$stageName)
	{
		$db = getDatabase();
		$result = $db -> prepareExecute('SELECT tb_stage.stageId FROM tb_stage WHERE tb_stage.stageName = ? AND tb_stage.projectId = ?;', array($stageName, $projectId));
		//判断是否存在这个阶段
		if ($result)
		{
			//存在则返回
			return $result['stageId'];
		}
		else
		{
			//不存在则插入数据库
			$db -> prepareExecute('INSERT INTO tb_stage(tb_stage.stageName,tb_stage.projectId)VALUES(?,?);', array($stageName, $projectId));
			if ($db -> getAffectRow() > 0)
				return $db -> getLastInsertID();
			else
				return FALSE;
		}
	}

	/**
	 * 新建任务
	 */
	public function addTask(&$members, &$taskName, &$stageId, &$taskBegin, &$taskEnd)
	{
		$db = getDatabase();
		$db -> prepareExecute('INSERT INTO tb_task(tb_task.taskName,tb_task.status,tb_task.stageId,tb_task.taskBegin,tb_task.taskEnd)VALUES(?,?,?,?,?);', array($taskName, 0, $stageId, $taskBegin, $taskEnd));
		//判断是否插入数据库成功
		if ($db -> getAffectRow() > 0)
		{
			//成功则把成员插入数据库
			$taskId = $db -> getLastInsertID();
			foreach ($members as $userId)
			{
				$db -> prepareExecute('INSERT INTO tb_taskmember(tb_taskmember.taskId,tb_taskmember.userId)VALUES(?,?);', array($taskId, $userId));
				if ($db -> getAffectRow() <= 0)
					break;
			}
			return TRUE;
		}
		else
		{
			//插入失败则返回
			return FALSE;
		}

	}

	/**
	 * 更新数据库的这个任务的信息
	 */
	public function updateTask(&$taskId, &$members, &$taskName, &$stageId, &$taskBegin, &$taskEnd)
	{
		$db = getDatabase();
		//更新这个任务的消息
		$db -> prepareExecute('UPDATE tb_task SET tb_task.taskName = ?, tb_task.stageId = ?, tb_task.taskBegin = ?, tb_task.taskEnd = ? WHERE tb_task.taskId = ?;', array($taskName, $stageId, $taskBegin, $taskEnd, $taskId));
		//更新成功则更新任务成员列表
		$db -> prepareExecute('DELETE FROM tb_taskmember WHERE tb_taskmember.taskId = ?', array($taskId));
		foreach ($members as $userId)
		{
			$db -> prepareExecute('INSERT INTO tb_taskmember(tb_taskmember.taskId,tb_taskmember.userId)VALUES(?,?);', array($taskId, $userId));
			if ($db -> getAffectRow() <= 0)
				break;
		}
		return TRUE;
	}

	/**
	 * 获取阶段名列表id
	 */
	public function getStageList(&$projectId)
	{
		$db = getDatabase();
		$result = $db -> prepareExecuteAll('SELECT tb_stage.stageId, tb_stage.stageName FROM tb_stage WHERE tb_stage.projectId = ?;', array($projectId));
		if ($result)
		{
			return $result;
		}
		else
		{
			return FALSE;
		}
	}

	/**
	 * 修改数据库的任务状态为完成状态
	 */
	public function finishTask(&$taskId)
	{
		$db = getDatabase();
		$db -> prepareExecute('UPDATE tb_task SET tb_task.status = ? WHERE tb_task.taskId = ?;', array(1, $taskId));
		if ($db -> getAffectRow() > 0)
			return TRUE;
		else
			return FALSE;
	}

	/**
	 * 修改数据中的任务状态为未完成状态
	 */
	public function cancelFinishTask(&$taskId)
	{
		$db = getDatabase();
		$db -> prepareExecute('UPDATE tb_task SET tb_task.status = ? WHERE tb_task.taskId = ?;', array(0, $taskId));
		if ($db -> getAffectRow() > 0)
			return TRUE;
		else
			return FALSE;
	}

	/**
	 * 删除任务
	 */
	public function cancelTask(&$taskId)
	{
		$db = getDatabase();
		$db -> prepareExecute('DELETE FROM tb_task WHERE tb_task.taskId =?;', array($taskId));
		if ($db -> getAffectRow() > 0)
			return TRUE;
		else
			return FALSE;
	}

}
