library(jsonlite)
library(dplyr)
library(digest)

haiviz_preloaded_data_path <- "build/data/preloaded"
haiviz_preloaded_json_path <- "build/data/preloaded_dataset.json"
target_preloaded_data_path <- "input_simulation"

preloaded_directories <- list.dirs(target_preloaded_data_path, full.names = FALSE, recursive = FALSE)
for(dir in preloaded_directories){
  source_dir_path <- paste(target_preloaded_data_path, dir, sep = "/")
  target_dir_path <- paste('./data/preloaded', dir, sep = "/")
  file.copy(source_dir_path, haiviz_preloaded_data_path, recursive = TRUE)
  preloaded_json <- fromJSON(haiviz_preloaded_json_path)
  project_df <- data.frame(id = paste(digest(project_list$id, algo = "md5", serialize = TRUE), dir, sep = '_'), 
                  name = paste0(dir), description = "Dummy dataset for testing purposes.", 
                  metadata = paste(target_dir_path, "metadata.csv", sep = '/') , map = paste(target_dir_path, "map.xml", sep = '/'),
                  tree = paste(target_dir_path, "tree.nwk", sep = '/'), network = paste(target_dir_path, "graph.dot", sep = '/'),
                  gantt = paste(target_dir_path, "movement.csv", sep = '/'))
  preloaded_json$data_list <- rbind(preloaded_json$data_list, project_df)              
  write_json(preloaded_json, haiviz_preloaded_json_path, pretty = TRUE)
}
