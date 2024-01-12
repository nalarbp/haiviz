library(tidyverse)
library(readxl)
library(ggpubr)

#data
data_long <- read_xlsx("input_simulation/performance_metrics.xlsx", sheet = "long_format")
size_columns <- c('size_50', 'size_250', 'size_500', 'size_750', 'size_1000')

#memory
memory_data <- data_long %>% filter(Metric == 'Memory')
memory_plot <- ggplot(memory_data, aes(x = factor(Size, levels = size_columns), y = Value, fill = Mode)) + 
  geom_bar(stat = "identity", position = "dodge") + 
  geom_point(aes(y = ifelse(Unresponsive_alert == 'Yes', Value + 20, NA)), position = position_dodge(width = 0.9), shape = 4, size = 1) +
  facet_grid(Browser ~ Device) + 
  labs(x = "Sample size", y = "Memory (MB)", title = "Memory usage", subtitle = 'Symbol x indicates unresponsive alert has been displayed for >1s') +
  scale_x_discrete(labels = function(x) str_remove(x, "size_")) +
  scale_y_continuous(breaks = seq(0, max(memory_data$Value), 100)) +
  theme_bw()
memory_plot

#cpu
cpu_data <- data_long %>% filter(Metric == 'CPU')
cpu_plot <- ggplot(cpu_data, aes(x = factor(Size, levels = size_columns), y = Value, fill = Mode)) + 
  geom_bar(stat = "identity", position = "dodge") + 
  geom_point(aes(y = ifelse(Unresponsive_alert == 'Yes', Value + 10, NA)), position = position_dodge(width = 0.9), shape = 4, size = 1) +
  facet_grid(Browser ~ Device) + 
  labs(x = "Sample size", y = "CPU (%)", title = "CPU usage", subtitle = 'Symbol x indicates unresponsive alert has been displayed for >1s') +
  scale_x_discrete(labels = function(x) str_remove(x, "size_")) +
  scale_y_continuous(breaks = seq(0, max(cpu_data$Value), 20)) +
  theme_bw()
cpu_plot

#memory and cpu
combined_plot <- ggarrange(memory_plot, cpu_plot, ncol = 1, nrow = 2, common.legend = TRUE, legend = "right")
combined_plot
