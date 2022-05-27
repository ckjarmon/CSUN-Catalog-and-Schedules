#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

#define NUM_THREADS 1000

void *PrintThread(void *t_id)
{
    long id = (long)t_id;
    printf("Thread #%ld\n", id);
    pthread_exit(NULL);
}

int main()
{
    pthread_t threads[NUM_THREADS];
    int rc;
    int i;
    for (i = 0; i < NUM_THREADS; i++)
    {
        printf("main(): creating thread -->> %d\n", i);
        rc = pthread_create(&threads[i], NULL, PrintThread, (void *)i);
        if (rc)
        {
            printf("Error:unable to create thread, %d\n", rc);
            exit(-1);
        }
    }
    pthread_exit(NULL);
}