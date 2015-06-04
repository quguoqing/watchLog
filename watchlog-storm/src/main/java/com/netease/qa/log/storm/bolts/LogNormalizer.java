package com.netease.qa.log.storm.bolts;

import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import backtype.storm.task.TopologyContext;
import backtype.storm.topology.BasicOutputCollector;
import backtype.storm.topology.IBasicBolt;
import backtype.storm.topology.OutputFieldsDeclarer;
import backtype.storm.tuple.Fields;
import backtype.storm.tuple.Tuple;
import backtype.storm.tuple.Values;

import com.netease.qa.log.meta.LogSource;
import com.netease.qa.log.meta.Project;
import com.netease.qa.log.storm.service.ConfigDataService;
import com.netease.qa.log.storm.service.ConfigDataLoadTask;

public class LogNormalizer implements IBasicBolt {

	private static final long serialVersionUID = 1L;
	private static final Logger logger = LoggerFactory.getLogger(LogNormalizer.class);


	@Override
	public void execute(Tuple input, BasicOutputCollector collector) {
		String hostname = input.getString(1);
        String path = input.getString(2);
        String filePattern = input.getString(3);
		LogSource logsource = ConfigDataService.getLogSource(hostname, path, filePattern);
		if(logsource == null) return;
		
		Project project = ConfigDataService.getProject(logsource.getProjectId());
		if(project == null) return;
		
		logger.debug("logsource======"  + logsource);
		logger.debug("project======"  + project);
		
		// 日志源启动了监控
		if (logsource.getLogSourceStatus() == 1) {
			collector.emit(new Values(input.getString(0), logsource.getLogSourceId(), project.getProjectId(), input.getValue(4)));
		}

	}
	
	
	public void declareOutputFields(OutputFieldsDeclarer declarer) {
		declarer.declare(new Fields("line", "logsource", "project", "dsTime"));
	}


	@Override
	public Map<String, Object> getComponentConfiguration() {
		return null;
	}


	@Override
	public void prepare(@SuppressWarnings("rawtypes") Map paramMap, TopologyContext paramTopologyContext) {
		ExecutorService POOL = Executors.newFixedThreadPool(1);
		POOL.submit(new ConfigDataLoadTask());
	}

 
	@Override
	public void cleanup() {
		
	}
	
}
