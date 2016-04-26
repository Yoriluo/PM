<?php
class ProjectController
{
	// 返回json类型
	private $returnJson = array('type' => 'project');

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
	 * 新建项目
	 */
	public function addProject()
	{
		$projectName = quickInput('projectName');
		$nameLen = strlen($projectName);
		//验证项目名格式是否合法
		if ($nameLen >= 2 && $nameLen <= 20)
		{
			//项目名格式合法
			$service = new ProjectModule();
			$result = $service -> addProject($projectName);
			//判断是否新建项目成功
			if ($result)
			{
				//新建项目成功
				$this -> returnJson['statusCode'] = '000000';
				$this -> returnJson['projectId'] = 'projectId';
			}
			else
			{
				//新建项目失败
				$this -> returnJson['statusCode'] = '200001';
			}

		}
		else
		{
			//项目名格式非法
			$this -> returnJson['statusCode'] = '200002';
		}

		exit(json_encode($this -> returnJson));
	}

	/**
	 * 获取全部项目
	 */
	public function getProjectList()
	{
		$service = new ProjectModule();
		$result1 = $service -> getMyProjectList();
		$result2 = $service -> getPartProjectList();
		//判断是否获取项目
		if ($result1 || $result2)
		{
			//获取项目成功
			$this -> returnJson['statusCode'] = '000000';
			$this -> returnJson['myProject'] = $result1;
			$this -> returnJson['partProject'] = $result2;
		}
		else
		{
			//获取项目失败
			$this -> returnJson['statusCode'] = '210001';
		}
		exit(json_encode($this -> returnJson));
	}

	/**
	 * 根据项目Id获取项目详情
	 */
	public function getProjectInfo()
	{
		$projectId = quickInput('projectId');
		//验证项目id格式是否合法
		if (preg_match('/^[0-9]{1,11}$/', $projectId))
		{
			//项目id格式合法
			$service = new ProjectModule();
			$result = $service -> getProjectInfo($projectId);
			//判断是否获取项目详情成功
			if ($result)
			{
				//获取项目详情成功
				$this -> returnJson['statusCode'] = '000000';
				$this -> returnJson['projectInfo'] = $result;
			}
			else
			{
				//获取项目详情失败
				$this -> returnJson['statusCode'] = '220001';
			}
		}
		else
		{
			//项目id格式非法
			$this -> returnJson['statusCode'] = '220002';
		}

		exit(json_encode($this -> returnJson));
	}

	public function getProjectInfoByTime()
	{
		$projectId = quickInput('projectId');
		//验证项目id格式是否合法
		if (preg_match('/^[0-9]{1,11}$/', $projectId))
		{
			//项目id格式合法
			$service = new ProjectModule();
			$result = $service -> getProjectInfoByTime($projectId);
			//判断是否获取项目详情成功
			if ($result)
			{
				//获取项目详情成功
				$this -> returnJson['statusCode'] = '000000';
				$this -> returnJson['projectInfo'] = $result;
			}
			else
			{
				//获取项目详情失败
				$this -> returnJson['statusCode'] = '220001';
			}
		}
		else
		{
			//项目id格式非法
			$this -> returnJson['statusCode'] = '220002';
		}

		exit(json_encode($this -> returnJson));
	}

	/**
	 * 申请加入项目
	 */
	public function joinProject()
	{
		$inviteNumber = quickInput('inviteNumber');
		//验证邀请码格式是否合法
		if (preg_match('/^[0-9a-z]{6}$/', $inviteNumber))
		{
			$service = new ProjectModule();
			$result = $service -> joinProject($inviteNumber);
			//判断是否申请加入项目成功
			if ($result)
			{
				//申请加入项目成功
				$this -> returnJson['statusCode'] = '000000';
			}
			else
			{
				//申请加入项目失败
				$this -> returnJson['statusCode'] = '230001';
			}
		}
		else
		{
			//邀请码格式非法
			$this -> returnJson['statusCode'] = '230002';
		}
		exit(json_encode($this -> returnJson));
	}

	/**
	 * 获取项目成员列表
	 */
	public function getPartnerList()
	{
		$projectId = quickInput('projectId');
		//验证项目id是否合法
		if (preg_match('/^[0-9]{1,11}$/', $projectId))
		{
			$service = new ProjectModule();
			$result = $service -> getPartnerList($projectId);
			//判断是否获取项目成员列表成功
			if ($result)
			{
				//获取项目成员列表成功
				$this -> returnJson['statusCode'] = '000000';
				$this -> returnJson['partnerList'] = $result;
			}
			else
			{
				//获取项目成员失败
				$this -> returnJson['statusCode'] = '240001';
			}
		}
		else
		{
			//项目id格式非法
			$this -> returnJson['statusCode'] = '240002';
		}
		exit(json_encode($this -> returnJson));
	}

	/**
	 * 完成项目
	 */
	public function finishProject()
	{
		$projectId = quickInput('projectId');
		//验证项目id格式是否合法
		if (preg_match('/^[0-9]{1,11}$/', $projectId))
		{
			//项目id格式合法
			$service = new ProjectModule();
			//判断是否完成项目成功
			if ($service -> finishProject($projectId))
				//完成项目成功
				$this -> returnJson['statusCode'] = '000000';
			else
				//完成项目失败
				$this -> returnJson['statusCode'] = '250001';
		}
		else
		{
			//项目id格式非法
			$this -> returnJson['statusCode'] = '250002';
		}
		exit(json_encode($this -> returnJson));
	}

}
