USE [RawDB]
GO

-------------------------------------------------------------------------------
-- Create SP Analysis             					                    				      |
-------------------------------------------------------------------------------
IF NOT EXISTS (
    SELECT *
    FROM dbo.sysobjects
    WHERE id = OBJECT_ID('bd_AnalyzeTableColumn')
    )
BEGIN
  CREATE TABLE bd_AnalyzeTableColumn (
    TableName NVARCHAR(80) NOT NULL,
    ColumnName NVARCHAR(80) NOT NULL,
    DataType NVARCHAR(50),
    Position INT,
    Kn INT,
    N INT,
    CONSTRAINT PK_bd_AnalyzeTableColumn PRIMARY KEY CLUSTERED (
      TableName,
      ColumnName
      )
    )
END
GO

IF NOT EXISTS (
    SELECT *
    FROM dbo.sysobjects
    WHERE id = OBJECT_ID('bd_TableCounts')
    )
BEGIN
  CREATE TABLE bd_TableCounts (
    TableName NVARCHAR(80) NOT NULL,
    N INT,
    CONSTRAINT PK_bd_TableCounts PRIMARY KEY CLUSTERED (TableName)
    )
END
GO

CREATE
  OR

ALTER FUNCTION [dbo].[fn_getTableCount] (@tableName VARCHAR(100))
RETURNS INT
AS
BEGIN
  DECLARE @N INT

  SELECT @N = s.row_count
  FROM sys.tables t
  JOIN sys.dm_db_partition_stats s
    ON t.object_id = s.object_id
      AND t.type_desc = 'USER_TABLE'
      AND t.name NOT LIKE '%dss%'
      AND s.index_id IN (0, 1)
      AND t.name = @tableName

  RETURN @N
END
GO

CREATE
  OR

ALTER PROCEDURE [dbo].[sp_AnalyzeTable] @tableName NVARCHAR(80),
  @strMsg VARCHAR(1000) OUTPUT
AS
BEGIN
  DECLARE @colName NVARCHAR(100),
    @dataType NVARCHAR(20),
    @pos INT,
    @Kn INT,
    @N INT
  -- Column name, serial no, distinct, count(*)
  DECLARE @sqlStr NVARCHAR(4000)

  -- Generated sql commands from table and column name
  SELECT @N = dbo.fn_getTableCount(@tableName)

  SELECT @strMsg = ''

  IF NOT EXISTS (
      SELECT *
      FROM bd_TableCounts
      WHERE TableName = @tableName
      ) -- update Table's object counts
    INSERT bd_TableCounts
    VALUES (
      @tableName,
      @N
      )
  ELSE
    UPDATE bd_TableCounts
    SET N = @N
    WHERE TableName = @tableName

  -- clear old data
  DELETE
  FROM bd_AnalyzeTableColumn
  WHERE TableName = @tableName

  DECLARE aCursor CURSOR
  FOR
  SELECT COLUMN_NAME,
    ORDINAL_POSITION,
    DATA_TYPE
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_NAME = @tableName
  ORDER BY ORDINAL_POSITION

  OPEN aCursor

  FETCH NEXT
  FROM aCursor
  INTO @colName,
    @pos,
    @dataType

  WHILE @@FETCH_STATUS = 0
  BEGIN
    SELECT @strMsg = @strMsg + @colName + ','

    SELECT @sqlStr = N'insert bd_AnalyzeTableColumn values(
        ''' + @tableName
      + ''',
        ''' + @colName + ''',
        ''' + @dataType + ''', ' + convert(
        VARCHAR(20), @pos) + ',
        ( select count(distinct "' + @colName + '") ' +
      '+ count(distinct case when "' + @colName + '" is null then 1 end) from ' +
      @tableName + ' ),
        ' + convert(VARCHAR(20), @N) + ' )'

    EXEC sp_executesql @sqlStr

    FETCH NEXT
    FROM aCursor
    INTO @colName,
      @pos,
      @dataType
  END

  CLOSE aCursor

  DEALLOCATE aCursor

  SELECT @strMsg = substring(@strMsg, 1, len(@strMsg) - 1)

  RETURN
END
