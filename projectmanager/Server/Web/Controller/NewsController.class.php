<?php
class NewsController
{
	// 返回json类型
	private $returnJson = array('type' => 'news');

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
	 * 获取全部消息
	 */
	public function getNewsList()
	{
		$service = new NewsModule();
		$result = $service -> getNewsList();
		//判断是否获取消息成功
		if ($result)
		{
			//获取消息成功
			$this -> returnJson['statusCode'] = '000000';
			$this -> returnJson['newsList'] = $result;
		}
		else
		{
			//获取消息失败
			$this -> returnJson['statusCode'] = '290001';
		}
		exit(json_encode($this -> returnJson));
	}

	/**
	 * 修改消息
	 */
	public function updateNews()
	{
		$newsId = quickInput('newsId');
		$flag = quickInput('flag');
		$projectId = quickInput('projectId');
		$projectName = quickInput('projectName');
		$proposerId = quickInput('proposerId');
		$nameLen = strlen($projectName);
		//验证消息id格式是否合法
		if (!preg_match('/^[0-9]{1,11}$/', $newsId))
		{
			//消息id格式非法
			$this -> returnJson['statusCode'] = '300001';
		}
		//验证项目id是否合法
		else if (!preg_match('/^[0-9]{1,11}$/', $projectId))
		{
			//项目id格式非法
			$this -> returnJson['statusCode'] = '300002';
		}
		//验证用户id格式是否合法
		else if (!preg_match('/^[0-9]{1,11}$/', $proposerId))
		{
			//用户id格式非法
			$this -> returnJson['statusCode'] = '300003';
		}
		//验证项目名是否合法
		else if ($nameLen < 2 || $nameLen > 30)
		{
			//项目名格式非法
			$this -> returnJson['statusCode'] = '300004';
		}
		else
		{
			$service = new NewsModule();
			//判断是否修改成功
			if ($service -> updateNews($newsId, $projectId, $projectName, $flag, $proposerId))
				//修改成功
				$this -> returnJson['statusCode'] = '000000';
			else
				//修改失败
				$this -> returnJson['statusCode'] = '300005';
		}
		exit(json_encode($this -> returnJson));

	}

	/**
	 * 提示未读消息数量
	 */
	public function getNewNewsNumber()
	{
		$service = new NewsModule();
		$result = $service -> getNewNewsNumber();
		//判断是否成功获取未读消息条数
		if ($result)
		{
			//成功获取未读消息条数
			$this -> returnJson['statusCode'] = '000000';
			$this -> returnJson['newNewsNumber'] = $result;
		}
		else
		{
			//获取未读消息条数失败
			$this -> returnJson['statusCode'] = '310001';
		}
		exit(json_encode($this -> returnJson));
	}

}
