<?php
class NewsDao
{
	/**
	 * 从数据库中获取个人全部消息
	 */
	public function getNewsList(&$ownId)
	{
		$db = getDatabase();
		$result = $db -> prepareExecuteAll('SELECT tb_news.newsId, tb_news.content, tb_news.flag, tb_news.projectId, tb_news.createTime, tb_news.proposerId, tb_project.projectName FROM tb_project INNER JOIN tb_news ON tb_project.projectId = tb_news.projectId WHERE tb_news.ownId = ? ORDER BY tb_news.createTime DESC;', array($ownId));
		//判断是否获取到消息
		if ($result)
		{
			//获取到消息则，更新消息状态为已读
			$db -> prepareExecute('UPDATE tb_news SET tb_news.status = ? WHERE tb_news.ownId = ? AND tb_news.status = ?;', array(1, $ownId, 0));
			return $result;
		}
		else
		{
			return FALSE;
		}

	}

	/**
	 * 更新消息
	 */
	public function updateNews(&$newsId, &$projectId, &$content, &$flag, &$userId)
	{
		$db = getDatabase();
		//更新用户对消息的操作标识
		$db -> prepareExecute('UPDATE tb_news SET tb_news.flag = ? WHERE tb_news.newsId = ?;', array($flag, $newsId));
		//判断用户是否对消息操作成功
		if ($db -> getAffectRow() > 0)
		{
			//用户对消息操作成功，把相应消息写进数据库发送给请求方
			$db -> prepareExecute('INSERT INTO tb_news(tb_news.content,tb_news.status,tb_news.flag,tb_news.createTime,tb_news.ownId,tb_news.projectId)VALUES(?,?,?,?,?,?);', array($content, 0, 3, date('Y-m-d H:i:s', time()), $userId, $projectId));
			//更新项目成员表
			if ($flag == 1)
				//用户同意请求，则把申请者加在项目成员列表的状态更新为成员状态
				$db -> prepareExecute('UPDATE tb_projectmember SET tb_projectmember.status = ? WHERE tb_projectmember.projectId = ? AND tb_projectmember.userId = ?;', array(1, $projectId, $userId));
			else
				//用户拒绝，则把申请方从项目成员表中删除
				$db -> prepareExecute('DELETE FROM tb_projectmember WHERE tb_projectmember.projectId = ? AND tb_projectmember.userId = ?;', array($projectId, $userId));
			return TRUE;
		}
		else
		{
			return FALSE;
		}
	}

	/**
	 * 获取未读消息条数
	 */
	public function getNewNewsNumber(&$ownId)
	{
		$db = getDatabase();
		$result = $db -> prepareExecute('SELECT COUNT(*) FROM tb_news WHERE tb_news.status = ? AND tb_news.ownId = ?;', array(0, $ownId));
		if ($result)
			return $result;
		else
			return FALSE;
	}

}
