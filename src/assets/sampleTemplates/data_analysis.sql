--Script to pull the SQL run since retention period.

Set pagesize 100
set lines 100
col name format a48
Col bytes format 999,999,999,999

select
extract( day from snap_interval) *24*60+
extract( hour from snap_interval) *60+
extract( minute from snap_interval ) "Snapshot Interval",
extract( day from retention) *24*60+
extract( hour from retention) *60+
extract( minute from retention ) "Retention Interval"
from dba_hist_wr_control;

SELECT retention FROM dba_hist_wr_control;


SELECT h.sample_time, u.username, h.program, h.module, s.sql_text 
FROM DBA_HIST_ACTIVE_SESS_HISTORY h, DBA_USERS u, DBA_HIST_SQLTEXT s 
WHERE sample_time >= SYSDATE – 30 --(We can give longer period) 
AND h.user_id=u.user_id 
AND h.sql_id = s.sql_iD 
ORDER BY h.sample_time; 