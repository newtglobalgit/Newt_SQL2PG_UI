spool <<dmap_db_script_output_path>>
--spool C:\Users\dsure\Downloads\Final_new_scripts\awr_trend.txt

REM Ver 2.0 - awr_trend.sql
REM - changes done by Bharani on 03-08-2023 - jira ticket  3704/3793
REM  note : redoMB is having with digits as 4 numeric part and 2 decimal part without rounding off and represented as MB
REM         --ROUND (f.average / 1024 / 1024, 1)
REM         -- ROUND (f.average / 1024 / 1024, 2),
REM (f.average / 1024 / 1024 ) "redoMB"
col "begintm" for a30
col "endtm"   for a30
col "snaps" for a20
col "inst" for 9999999999
col "day" for a15
col "elap(min)"   for 99999
col "dbtm(min)"   for 99999
col "Host CPU%"   for 99999
col "Inst CPU%"   for 99999
col "actses(mx)" for a14
col "logons(mx)" for a14
col "sqlexec"   for 9999999999
col "lioblks"   for 9999999999
col "readioMB"  for 9999999999
col "writeioMB" for 9999999999
col "hardparse" for 9999999999
col "utrans"    for 9999999999
col "ucommits"  for 9999999999
col "urbacks"   for 9999999999
col "redoMB"    for 9999990000.99
col "blkchg"    for 9999999999
col "rdiops"    for 9999999999
col "wtiops"    for 9999999999
col "endses#" for 9999999999
set termout off
set verify off
set trimspool on
set linesize 2000
set longchunksize 200000
set long 200000
set pagesize 5000
set wrap on
set feedback off
set heading off

prompt Script_Start - AWR trend from dba_hist_snapshot for last 30 days

SELECT 
	subquery."inst"||'NG_DMAP_DELIMITER'||subquery."snaps"||'NG_DMAP_DELIMITER'||subquery."day"||'NG_DMAP_DELIMITER'||subquery."begintm"||'NG_DMAP_DELIMITER'||subquery."endtm"||'NG_DMAP_DELIMITER'||subquery."elap(min)"||'NG_DMAP_DELIMITER'||subquery."dbtm(min)"||'NG_DMAP_DELIMITER'||subquery."Host CPU%"||'NG_DMAP_DELIMITER'||subquery."Inst CPU%"||'NG_DMAP_DELIMITER'||subquery."actses(mx)"||'NG_DMAP_DELIMITER'||subquery."logons(mx)"||'NG_DMAP_DELIMITER'||subquery."sqlexec"||'NG_DMAP_DELIMITER'||subquery."lioblks"||'NG_DMAP_DELIMITER'||subquery."readioMB"||'NG_DMAP_DELIMITER'||subquery."writeioMB"||'NG_DMAP_DELIMITER'||subquery."hardparse"||'NG_DMAP_DELIMITER'||subquery."utrans"||'NG_DMAP_DELIMITER'||subquery."ucommits"||'NG_DMAP_DELIMITER'||subquery."urbacks"||'NG_DMAP_DELIMITER'||subquery."redoMB"||'NG_DMAP_DELIMITER'||subquery."blkchg"||'NG_DMAP_DELIMITER'||subquery."rdiops"||'NG_DMAP_DELIMITER'||subquery."wtiops"||'NG_DMAP_DELIMITER'||subquery."endses#"||'NG_DMAP_DELIMITER'||'NG_DMAP_END'
FROM (
	SELECT a.instance_number
			 "inst",
		 a.snap_id - 1 || '-' || a.snap_id
			 "snaps",
		 TO_CHAR (a.begin_interval_time, 'DAY')
			 "day",
		 TO_CHAR (a.begin_interval_time, 'DD-MON-YYYY HH24:MI:SS')
			 "begintm",
		 TO_CHAR (a.end_interval_time, 'DD-MON-YYYY HH24:MI:SS')
			 "endtm",
		 ROUND ((  CAST (a.end_interval_time AS DATE)
				- CAST (a.begin_interval_time AS DATE))
			 * 1440,
			 2)
			 AS "elap(min)",
		 ROUND ((b1.VALUE - b2.VALUE) / 1000000 / 60, 2)
			 "dbtm(min)",
		 ROUND (d.average, 2)
			 "Host CPU%",
		 ROUND (inst_cpu_util, 0)
			 "Inst CPU%",
		 ROUND (e.maxval, 0)
			 "actses(mx)",
		 ROUND (h.maxval, 0)
			 "logons(mx)",
		 ROUND (j.average, 0)
			 "sqlexec",
		 ROUND (o.average, 0)
			 "lioblks",
		 ROUND (p.average / 1024 / 1024, 0)
			 "readioMB",
		 ROUND (q.average / 1024 / 1024, 0)
			 "writeioMB",
		 ROUND (k.average, 0)
			 "hardparse",
		 ROUND (l.average, 0)
			 "utrans",
		 ROUND (l1.average, 0)
			 "ucommits",
		 ROUND (m.average, 0)
			 "urbacks",
		 (f.average / 1024 / 1024 )
			 "redoMB",
		 ROUND (g.average, 0)
			 "blkchg",
		 Avg_Reads_Io_Sec
			 "rdiops",
		 Avg_Writes_Io_Sec
			 "wtiops",
		 n.VALUE
			 "endses#"
	FROM dba_hist_snapshot         a,
		 dba_hist_sys_time_model   b1,
		 dba_hist_sys_time_model   b2,
		 dba_hist_sysmetric_summary d,
		 dba_hist_sysmetric_summary e,
		 dba_hist_sysmetric_summary f,
		 dba_hist_sysmetric_summary g,
		 dba_hist_sysmetric_summary h,
		 dba_hist_sysmetric_summary i,
		 dba_hist_sysmetric_summary j,
		 dba_hist_sysmetric_summary k,
		 dba_hist_sysmetric_summary l,
		 dba_hist_sysmetric_summary l1,
		 dba_hist_sysmetric_summary m,
		 dba_hist_sysmetric_summary o,
		 dba_hist_sysmetric_summary p,
		 dba_hist_sysmetric_summary q,
		 dba_hist_sysstat          n,
		 (SELECT snap_id,
				 instance_number,
				 dbid,
				 ROUND (cpu / elapsed_seconds / num_cpu * 100, 2)    inst_cpu_util
			FROM (SELECT t3.snap_id,
						 t3.instance_number,
						 t3.dbid,
						   ROUND ((t1.VALUE - t2.VALUE) / 1000000, 3)
						 + ROUND ((t4.VALUE - t5.VALUE) / 1000000, 3)
							 CPU,
						   (  EXTRACT (
								  HOUR FROM ((  t3.end_interval_time
											  - t3.begin_interval_time)))
							* 3600)
						 + (  EXTRACT (
								  MINUTE FROM ((  t3.end_interval_time
												- t3.begin_interval_time)))
							* 60)
						 + EXTRACT (
							   SECOND FROM ((  t3.end_interval_time
											 - t3.begin_interval_time)))
							 elapsed_seconds,
						 (SELECT VALUE
							FROM v$osstat
						   WHERE stat_name = 'NUM_CPUS')
							 num_cpu
					FROM dba_hist_sys_time_model t1,
						 dba_hist_sys_time_model t2,
						 dba_hist_sys_time_model t4,
						 dba_hist_sys_time_model t5,
						 dba_hist_snapshot      t3
				   WHERE     t1.dbid = t3.dbid
						 AND t1.snap_id = t3.snap_id
						 AND t1.instance_number = t3.instance_number
						 AND t1.stat_name = 'DB CPU'
						 AND t1.stat_name = t2.stat_name
						 AND t1.dbid = t2.dbid
						 AND t1.instance_number = t2.instance_number
						 AND t2.snap_id = (t1.snap_id - 1)
						 AND t4.dbid = t3.dbid
						 AND t4.snap_id = t3.snap_id
						 AND t4.instance_number = t3.instance_number
						 AND t4.stat_name = 'background cpu time'
						 AND t4.stat_name = t5.stat_name
						 AND t4.dbid = t5.dbid
						 AND t4.instance_number = t5.instance_number
						 AND t5.snap_id = (t4.snap_id - 1))) v1,
		 (SELECT snap.snap_id,
				 snap.instance_number,
				 snap.dbid,
				 ROUND (
					 ABS (
						   (A.VALUE - B.VALUE)
						 / (  (  EXTRACT (
									 HOUR FROM ((  Snap.End_Interval_Time
												 - Snap.Begin_Interval_Time)))
							   * 3600)
							+ (  EXTRACT (
									 MINUTE FROM ((  Snap.End_Interval_Time
												   - Snap.Begin_Interval_Time)))
							   * 60)
							+ EXTRACT (
								  SECOND FROM ((  snap.end_interval_time
												- snap.begin_interval_time))))))
					 Flash_Reads_IO_Sec,
				 ROUND (Read_Io.Average)
					 Avg_Reads_Io_Sec,
				 ROUND (Write_Io.Average)
					 Avg_Writes_Io_Sec,
				 ROUND (Read_Io.Maxval)
					 Max_Reads_Io_Sec,
				 ROUND (Write_Io.Maxval)
					 Max_Writes_Io_Sec
			FROM Dba_Hist_Snapshot         Snap,
				 Dba_Hist_Sysstat          A,
				 Dba_Hist_Sysstat          B,
				 Dba_Hist_Sysmetric_Summary Read_Io,
				 Dba_Hist_Sysmetric_Summary Write_Io
		   WHERE     a.dbid = snap.dbid
				 AND A.Snap_Id = Snap.Snap_Id
				 AND A.Instance_Number = Snap.Instance_Number
				 AND A.Stat_Name = 'physical read requests optimized'
				 AND a.dbid = b.dbid
				 AND B.Snap_Id = (A.Snap_Id - 1)
				 AND A.Stat_Name = B.Stat_Name
				 AND A.Instance_Number = B.Instance_Number
				 AND Snap.dbid = Read_Io.dbid
				 AND Snap.Snap_Id = Read_Io.Snap_Id
				 AND snap.Instance_Number = Read_Io.Instance_Number
				 AND Read_Io.Metric_Name =
					 'Physical Read Total IO Requests Per Sec'
				 AND Snap.dbid = write_Io.dbid
				 AND snap.Snap_Id = Write_Io.Snap_Id
				 AND snap.Instance_Number = Write_Io.Instance_Number
				 AND Write_Io.Metric_Name =
					 'Physical Write Total IO Requests Per Sec') v2
	WHERE     TRUNC (a.begin_interval_time) >= TRUNC (SYSDATE) - 30
		 AND a.dbid = b1.dbid
		 AND a.instance_number = b1.instance_number
		 AND a.snap_id = b1.snap_id
		 AND b1.stat_name = 'DB time'
		 AND b1.stat_name = b2.stat_name
		 AND b1.dbid = b2.dbid
		 AND b1.instance_number = b2.instance_number
		 AND b2.snap_id = (b1.snap_id - 1)
		 AND a.dbid = d.dbid
		 AND a.instance_number = d.instance_number
		 AND a.snap_id = d.snap_id
		 AND d.metric_name = 'Host CPU Utilization (%)'
		 AND a.dbid = e.dbid
		 AND a.instance_number = e.instance_number
		 AND a.snap_id = e.snap_id
		 AND e.metric_name = 'Average Active Sessions'
		 AND a.dbid = f.dbid
		 AND a.instance_number = f.instance_number
		 AND a.snap_id = f.snap_id
		 AND f.metric_name = 'Redo Generated Per Sec'
		 AND a.dbid = g.dbid
		 AND a.instance_number = g.instance_number
		 AND a.snap_id = g.snap_id
		 AND g.metric_name = 'DB Block Changes Per Sec'
		 AND a.dbid = h.dbid
		 AND a.instance_number = h.instance_number
		 AND a.snap_id = h.snap_id
		 AND h.metric_name = 'Logons Per Sec'
		 AND a.dbid = i.dbid
		 AND a.instance_number = i.instance_number
		 AND a.snap_id = i.snap_id
		 AND i.metric_name = 'Average Synchronous Single-Block Read Latency'
		 AND a.dbid = j.dbid
		 AND a.instance_number = j.instance_number
		 AND a.snap_id = j.snap_id
		 AND j.metric_name = 'Executions Per Sec'
		 AND a.dbid = k.dbid
		 AND a.instance_number = k.instance_number
		 AND a.snap_id = k.snap_id
		 AND k.metric_name = 'Hard Parse Count Per Sec'
		 AND a.dbid = l.dbid
		 AND a.instance_number = l.instance_number
		 AND a.snap_id = l.snap_id
		 AND l.metric_name = 'User Transaction Per Sec'
		 AND a.dbid = l1.dbid
		 AND a.instance_number = l1.instance_number
		 AND a.snap_id = l1.snap_id
		 AND l1.metric_name = 'User Commits Per Sec'
		 AND a.dbid = m.dbid
		 AND a.instance_number = m.instance_number
		 AND a.snap_id = m.snap_id
		 AND m.metric_name = 'User Rollbacks Per Sec'
		 AND a.dbid = n.dbid
		 AND a.instance_number = n.instance_number
		 AND a.snap_id = n.snap_id
		 AND n.stat_name = 'logons current'
		 AND a.dbid = v1.dbid
		 AND a.instance_number = v1.instance_number
		 AND a.snap_id = v1.snap_id
		 AND a.dbid = v2.dbid
		 AND a.instance_number = v2.instance_number
		 AND a.snap_id = v2.snap_id
		 AND a.dbid = o.dbid
		 AND a.instance_number = o.instance_number
		 AND a.snap_id = o.snap_id
		 AND o.metric_name = 'Logical Reads Per Sec'
		 AND a.dbid = p.dbid
		 AND a.instance_number = p.instance_number
		 AND a.snap_id = p.snap_id
		 AND p.metric_name = 'Physical Read Bytes Per Sec'
		 AND a.dbid = q.dbid
		 AND a.instance_number = q.instance_number
		 AND a.snap_id = q.snap_id
		 AND q.metric_name = 'Physical Write Bytes Per Sec'
	ORDER BY a.snap_id, a.instance_number
) subquery;
/
prompt
prompt Script_End - AWR trend from dba_hist_snapshot for last 30 days

spool off
quit;
/