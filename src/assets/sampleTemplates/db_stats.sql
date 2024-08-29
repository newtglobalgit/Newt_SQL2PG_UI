set termout off
set verify off
set trimspool on
set linesize 2000
set longchunksize 200000
set long 200000
set pagesize 5000
set wrap on
set feedback off
spool <<dmap_db_script_output_path>>
--spool D:\db_stats_output.txt
select 'Host_Name' as Param,host_name from v$instance;
prompt #######################################
SET LINESIZE 900
COL ORACLE_VERSION FOR A100
    SELECT  'Oracle_Version' as Param,Banner_full AS oracle_version
    FROM
  v$version;
prompt #######################################
col os_version for a50
    SELECT 'OS_Version' as Param,
    dbms_utility.port_string AS os_version
    FROM
    dual;
prompt #######################################

select 'CPU_Details' as Param,cpu.value NUM_CPUS
, core.value NUM_CPU_CORES
, socket.value NUM_CPU_SOCKETS
, ram.value MEMORY_GB
from (select to_char(VALUE) value
from v$osstat
where stat_name = 'NUM_CPUS') cpu
, (select sum(value) value
from v$osstat
where stat_name = 'NUM_CPU_CORES') core
, (select sum(value) value
from v$osstat where stat_name='NUM_CPU_SOCKETS') socket
,(select round(VALUE/1024/1024/1024,0) value
from v$osstat where stat_name='PHYSICAL_MEMORY_BYTES') ram;

prompt #######################################
select 'SGA_Details' as Param,round(used.bytes /1024/1024 ,2) sga_used_mb
, round(free.bytes /1024/1024 ,2) sga_free_mb
, round(tot.bytes /1024/1024 ,2) sga_total_mb
from (select sum(bytes) bytes
from v$sgastat
where name != 'free memory') used
, (select sum(bytes) bytes
from v$sgastat
where name = 'free memory') free
, (select sum(bytes) bytes
from v$sgastat) tot ;
prompt #######################################
Col Name format a48

select 'PGA_Details' as Param,round(used.bytes /1024/1024 ,2) pga_used_mb
, round(free.bytes /1024/1024 ,2) pga_free_mb
, round(tot.bytes /1024/1024 ,2) pga_total_mb
from (select sum(value) bytes
from v$pgastat
where name = 'total PGA inuse') used
, (select sum(value) bytes
from v$pgastat
where name = 'total freeable PGA memory') free
, (select sum(value) bytes
from v$pgastat where name='total PGA allocated') tot ;
prompt #######################################
 
spool off;

quit;
/
