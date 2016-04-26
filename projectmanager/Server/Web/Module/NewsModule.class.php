<?php
class NewsModule
{
	/**
	 * 获取全部消息
	 */
	public function getNewsList()
	{
		$dao = new NewsDao;
		return $dao -> getNewsList($_SESSION['userId']);

	}

	/**
	 * 修改消息
	 */
	public function updateNews(&$newsId, &$projectId, &$projectName, &$flag, &$proposerId)
	{
		$dao = new NewsDao;
		//判断操作类型
		if ($flag == 1)
		{
			//执行同意操作
			$content = $_SESSION['userName'] . '同意了你加入' . $projectName . '项目的请求';
		}
		else if ($flag == 2)
		{
			//执行拒绝操作
			$content = $_SESSION['userName'] . '拒绝了你加入' . $projectName . '项目的请求';
		}
		else
		{
			return FALSE;
		}
		return $dao -> updateNews($newsId, $projectId, $content, $flag, $proposerId);
	}

	/**
	 * 获取未读消息数量
	 */
	public function getNewNewsNumber()
	{
		$dao = new NewsDao;
		return $dao -> getNewNewsNumber($_SESSION['userId']);
	}

}
