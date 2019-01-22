#!/bin/bash
WEB_HELP=`cat ../../../uttUserConf/web-config | grep -e "^WEB_HELP"| sed  's/WEB_HELP=//g'`
srcZhcnPath=./helpConfig/zhcn
srcEnPath=./helpConfig/en
srcZhtwPath=./helpConfig/zhtw
zhcnDstFile=../lang/zhcn/helpConfig.js
enDstFile=../lang/en/helpConfig.js
zhtwDstFile=../lang/zhtw/helpConfig.js

#allFile="$zhcnDstFile $enDstFile $zhtwDstFile"
allFile="$zhcnDstFile"
for dstFile in $allFile
do
    echo "define({
		"help":[" > $dstFile
    for file in $WEB_HELP
    do
	if [ "$dstFile" == "$zhcnDstFile" ]
	then
	    echo $file
	    isUtf=`file -i $srcZhcnPath/$file | grep "utf-8"`
	    if [ "$isUtf" != "" ];
	    then  
		cat $srcZhcnPath/$file >> $dstFile
	    else
		echo "--------$srcZhcnPath/$file is not utf-8---------"
		#iconv -f GBK -t UTF-8 $srcZhcnPath/$file -o $dstFile
		#iconv -f GBK -t UTF-8 $dstFile  -o $dstFile
	    fi
	elif [ "$dstFile" == "$enDstFile" ]
	then
	    isUtf=`file -i $srcEnPath/$file | grep "utf-8"`
	    if [ "$isUtf" != "" ];
	    then  
		cat $srcEnPath/$file >> $dstFile
	    else
		echo "--------$srcEnPath/$file is not utf-8---------"
		#iconv -f GBK -t UTF-8 $srcEnPath/$file -o $dstFile
		#iconv -f GBK -t UTF-8 $dstFile  -o $dstFile
	    fi
	elif [ "$dstFile" == "$zhtwDstFile" ]
	then
	    isUtf=`file -i $srcZhtwPath/$file | grep "utf-8"`
	    if [ "$isUtf" != "" ];
	    then  
		cat $srcZhtwPath/$file >> $dstFile
	    else$srcZhtwPath/$file 
		echo "--------$srcZhtwPath/$file is not utf-8---------"
		#iconv -f  GBK -t UTF-8 $srcZhtwPath/$file -o $dstFile
		#iconv -f GBK -t UTF-8 $dstFile  -o $dstFile
	    fi
	fi
	echo "," >> $dstFile
    done
    echo "	    ]
    });" >> $dstFile 
done
