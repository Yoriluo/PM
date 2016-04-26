<?php
class TaskModule
{
	/**
	 * 新建任务
	 */
	public function addTask(&$projectId, &$members, &$taskName, &$stageName, &$taskBegin, &$taskEnd)
	{
		$dao = new TaskDao;
		//获取阶段id
		$result = $dao -> addStage($projectId, $stageName);
		if ($result)
			return $dao -> addTask($members, $taskName, $result, $taskBegin, $taskEnd);
		else
			return FALSE;

	}

	/**
	 * 修改任务
	 */
	public function updateTask(&$projectId, &$taskId, &$members, &$taskName, &$stageName, &$taskBegin, &$taskEnd)
	{
		$dao = new TaskDao;
		//获取阶段id
		$result = $dao -> addStage($projectId, $stageName);
		if ($result)
			return $dao -> updateTask($taskId, $members, $taskName, $result, $taskBegin, $taskEnd);
		else
			return FALSE;
	}

	/**
	 * 获取阶段名列表
	 */
	public function getStageList(&$projectId)
	{
		$dao = new TaskDao;
		return $dao -> getStageList($projectId);
	}

	/**
	 * 成员完成任务
	 */
	public function finishTask(&$taskId)
	{
		$dao = new TaskDao;
		return $dao -> finishTask($taskId);
	}

	/**
	 * 取消任务完成状态
	 */
	public function cancelFinishTask(&$taskId)
	{
		$dao = new TaskDao;
		return $dao -> cancelFinishTask($taskId);
	}

	/**
	 * 取消任务
	 */
	public function cancelTask(&$taskId)
	{
		$dao = new TaskDao;
		return $dao -> cancelTask($taskId);
	}

}
