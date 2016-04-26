<?php
class TaskController
{
	// 返回json类型
	private $returnJson = array('type' => 'task');

	/**
	 * 构造函数，验证身份
	 */
	public function __construct()
	{
		session_start();
		if (quickInput('userToken') != $_SESSION['userToken'])
		{
			$this -> returnJson['statusCode'] = '000001';
			exit(json_encode($this -> returnJson));
		}
	}

	/**
	 * 新建任务
	 */
	public function addTask()
	{
		$projectId = quickInput('projectId');
		$str = quickInput('members');
		$members = explode(',', $str);
		$taskName = quickInput('taskName');
		$stageName = quickInput('stageName');
		$taskBegin = quickInput('taskBegin');
		$taskEnd = quickInput('taskEnd');
		$taskNameLen = strlen($taskName);
		$stageNameLen = strlen($stageName);
		//验证项目id格式是否合法
		if (!preg_match('/^[0-9]{1,11}$/', $projectId))
		{
			//项目id格式不合法
			$this -> returnJson['statusCode'] = '260001';
		}
		//判断任务名格式是否合法
		else if ($taskNameLen < 2 || $taskNameLen > 20)
		{
			//任务名格式不合法
			$this -> returnJson['statusCode'] = '260002';
		}
		//判断阶段名是否合法
		else if ($stageNameLen < 2 || $stageNameLen > 20)
		{
			//阶段名格式不合法
			$this -> returnJson['statusCode'] = '260003';
		}
		//判断任务期限格式是否合法
		else if (!strtotime($taskBegin) || !strtotime($taskEnd))
		{
			//阶段期限格式非法
			$this -> returnJson['statusCode'] = '260004';
		}
		else
		{
			$service = new TaskModule();
			//判断新建任务是否成功
			if ($service -> addTask($projectId, $members, $taskName, $stageName, $taskBegin, $taskEnd))
			{
				//新建任务成功
				$this -> returnJson['statusCode'] = '000000';
			}
			else
			{
				//新建任务不成功
				$this -> returnJson['statusCode'] = '260005';
			}
		}
		exit(json_encode($this -> returnJson));
	}

	/**
	 * 修改任务
	 */
	public function updateTask()
	{
		$projectId = quickInput('projectId');
		$taskId = quickInput('taskId');
		$str = quickInput('members');
		$members = explode(',', $str);
		$taskName = quickInput('taskName');
		$stageName = quickInput('stageName');
		$taskBegin = quickInput('taskBegin');
		$taskEnd = quickInput('taskEnd');
		$taskNameLen = strlen($taskName);
		$stageNameLen = strlen($stageName);
		//验证项目id格式是否合法
		if (!preg_match('/^[0-9]{1,11}$/', $projectId))
		{
			//项目id格式非法
			$this -> returnJson['statusCode'] = '270001';
		}
		//验证任务id格式是否合法
		else if (!preg_match('/^[0-9]{1,11}$/', $taskId))
		{
			//任务id格式非法
			$this -> returnJson['statusCode'] = '270002';
		}
		//验证任务名格式是否合法
		else if ($taskNameLen < 2 || $taskNameLen > 20)
		{
			//任务名格式非法
			$this -> returnJson['statusCode'] = '270003';
		}
		//判断阶段名格式是否合法
		else if ($stageNameLen < 2 || $stageNameLen > 20)
		{
			$this -> returnJson['statusCode'] = '270004';
		}
		//判断任务期限格式是否合法
		else if (!strtotime($taskBegin) || !strtotime($taskEnd))
		{
			//阶段期限格式非法
			$this -> returnJson['statusCode'] = '270005';
		}
		else
		{
			$service = new TaskModule();
			//判断是否修改任务成功
			if ($service -> updateTask($projectId, $taskId, $members, $taskName, $stageName, $taskBegin, $taskEnd))
			{
				//修改任务成功
				$this -> returnJson['statusCode'] = '000000';
			}
			else
			{
				//修改任务失败
				$this -> returnJson['statusCode'] = '270006';
			}
		}
		exit(json_encode($this -> returnJson));
	}

	/**
	 * 获取阶段名列表
	 */
	public function getStageList()
	{
		$projectId = quickInput('projectId');
		//验证项目id是否合法
		if (preg_match('/^[0-9]{1,11}$/', $projectId))
		{
			//项目id格式合法
			$service = new TaskModule();
			$result = $service -> getStageList($projectId);
			//判断是否获取阶段名列表成功
			if ($result)
			{
				//获取阶段列表名成功
				$this -> returnJson['statusCode'] = '000000';
				$this -> returnJson['stageList'] = $result;
			}
			else
			{
				$this -> returnJson['statusCode'] = '330001';
			}
		}
		else
		{
			//项目id格式非法
			$this -> returnJson['statusCode'] = '330002';
		}

		exit(json_encode($this -> returnJson));
	}

	/**
	 * 成员完成任务
	 */
	public function finishTask()
	{
		$taskId = quickInput('taskId');
		//验证任务id格式是否合法
		if (preg_match('/^[0-9]{1,11}$/', $taskId))
		{
			//任务格式合法
			$service = new TaskModule();
			//判断是否成功完成任务
			if ($service -> finishTask($taskId))
			{
				//成功完成任务
				$this -> returnJson['statusCode'] = '000000';
			}
			else
			{
				//完成任务失败
				$this -> returnJson['statusCode'] = '280001';
			}
		}
		else
		{
			//任务id格式非法
			$this -> returnJson['statusCode'] = '280002';
		}
		exit(json_encode($this -> returnJson));
	}

	/**
	 * 取消任务完成状态
	 */
	public function cancelFinishTask()
	{
		$taskId = quickInput('taskId');
		//验证任务id格式是否合法
		if (preg_match('/^[0-9]{1,11}$/', $taskId))
		{
			//任务格式合法
			$service = new TaskModule();
			//判断是否成功完成任务
			if ($service -> cancelFinishTask($taskId))
			{
				//成功完成任务
				$this -> returnJson['statusCode'] = '000000';
			}
			else
			{
				//完成任务失败
				$this -> returnJson['statusCode'] = '320001';
			}
		}
		else
		{
			//任务id格式非法
			$this -> returnJson['statusCode'] = '320002';
		}
		exit(json_encode($this -> returnJson));
	}

	/**
	 * 取消任务
	 */
	public function cancelTask()
	{
		$taskId = quickInput('taskId');
		//验证任务id格式是否合法
		if (preg_match('/^[0-9]{1,11}$/', $taskId))
		{
			//任务格式合法
			$service = new TaskModule();
			//判断是否成功完成任务
			if ($service -> cancelTask($taskId))
			{
				//成功完成任务
				$this -> returnJson['statusCode'] = '000000';
			}
			else
			{
				//完成任务失败
				$this -> returnJson['statusCode'] = '330001';
			}
		}
		else
		{
			//任务id格式非法
			$this -> returnJson['statusCode'] = '330002';
		}
		exit(json_encode($this -> returnJson));
	}

}
