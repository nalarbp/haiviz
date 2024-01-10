library(igraph)

isolate <- c(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,20,21,22,23,24,25,26,27,28,29,30)
dist <- matrix(0, nrow = length(isolate), ncol = length(isolate))
for (i in 1:length(isolate)) {
    for (j in 1:length(isolate)) {
        dist[i, j] <- round(sample(1:15, 1))
    }
}
g <- graph.adjacency(dist, mode = "undirected", weighted = TRUE, diag = FALSE)
V(g)$name <- isolate
g_filtered <- delete.edges(g, which(E(g)$weight > 3))
plot(g_filtered)

write.graph(g_filtered, file = "public/data/preloaded/pipe_2/network.gv", format = "dot")
