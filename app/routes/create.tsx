import {useState} from 'react';
import {Controller, useFieldArray, useForm} from 'react-hook-form';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea
} from '@heroui/react';
import {useNavigate} from '@remix-run/react';
import {useMutation, useQuery} from '@tanstack/react-query';
import {api} from '~/providers/api';
import type {ModeratorsResponse} from '~/types';

// YouTube URL validation regex
const YOUTUBE_REGEX = /^(https?:\/\/)?(www\.|music\.)?(youtube\.com|youtu\.?be)\/.+$/;

type FormValues = {
  title: string;
  description: string;
  is_public: boolean;
  songs: { url: string }[];
  voice_id?: string;
  voice_description?: string;
};

export default function Create() {
  const [error, setError] = useState<string | null>(null);
  const [bulkUrlsModalOpen, setBulkUrlsModalOpen] = useState(false);
  const [bulkUrlsInput, setBulkUrlsInput] = useState('');
  const [bulkUrlsError, setBulkUrlsError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch moderators list
  const {data: moderators, isLoading: moderatorsLoading} = useQuery<ModeratorsResponse>({
    queryKey: ['moderators'],
    queryFn: async () => {
      const response = await api.get('/voiceover/moderators');
      return response.data;
    }
  });

  const {control, register, handleSubmit, formState: {errors}, setValue, watch} = useForm<FormValues>({
    defaultValues: {
      title: '',
      description: '',
      is_public: true,
      songs: [{url: ''}],
      voice_id: undefined,
      voice_description: '',
    },
  });

  // Watch voice_id to enable/disable personality field
  const selectedVoiceId = watch('voice_id');

  const {fields, append, remove} = useFieldArray({
    control,
    name: "songs",
  });

  // Function to process bulk URLs
  const processBulkUrls = () => {
    setBulkUrlsError(null);
    const urls = bulkUrlsInput.split(/[\n\r]+/).filter(url => url.trim() && YOUTUBE_REGEX.test(url.trim()));

    if (urls.length === 0) {
      setBulkUrlsError("No valid YouTube URLs found. Please check your input.");
      return;
    }

    // Remove all current fields except the first one
    for (let i = fields.length - 1; i >= 0; i--) {
      if (i > 0) remove(i);
    }

    // Set the first field to the first URL
    setValue("songs.0.url", urls[0]);

    // Add remaining URLs as new fields
    urls.slice(1).forEach(url => {
      append({url: url.trim()});
    });

    // Close modal and reset input
    setBulkUrlsModalOpen(false);
    setBulkUrlsInput('');
  };

  // Create radio mutation with React Query
  const createRadioMutation = useMutation({
    mutationFn: async (formData: FormValues) => {
      try {
        const response = await api.post('/radios', formData);
        return response.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        // Handle axios error
        const errorMessage = error.response?.data?.message ||
          `Failed to create radio (${error.response?.status || 'Network error'})`;
        throw new Error(errorMessage);
      }
    },
    onSuccess: () => {
      // Redirect to dashboard on success
      navigate('/dashboard');
    },
    onError: (err) => {
      console.error('Error creating radio:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    },
  });

  const onSubmit = async (data: FormValues) => {
    setError(null);

    // Filter out empty URLs
    const filteredSongs = data.songs.filter(song => song.url.trim() !== '');

    if (filteredSongs.length === 0) {
      setError('Please add at least one YouTube URL');
      return;
    }

    // Prepare the form data
    const formData = {
      ...data,
      songs: filteredSongs,
    };

    // Only include voice fields if a voice is selected
    if (!data.voice_id) {
      delete formData.voice_id;
      delete formData.voice_description;
    } else if (!data.voice_description || data.voice_description.trim() === '') {
      // If no personality is provided, don't include it
      delete formData.voice_description;
    }

    createRadioMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Create New Radio Station</h1>

        <Card className="shadow-lg">
          <CardHeader className="pb-0">
            <h2 className="text-xl font-bold">Radio Details</h2>
          </CardHeader>

          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
              {/* Title Field */}
              <div className="flex flex-col gap-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Station Title <span className="text-red-500">*</span>
                </label>
                <Input
                  id="title"
                  placeholder="My Awesome Radio Station"
                  {...register("title", {required: "Title is required"})}
                  color={errors.title ? "danger" : "default"}
                  errorMessage={errors.title?.message}
                />
              </div>

              {/* Description Field */}
              <div className="flex flex-col gap-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  placeholder="Tell listeners about your radio station"
                  {...register("description")}
                />
              </div>

              {/* Public Toggle */}
              <div>
                <Controller
                  name="is_public"
                  control={control}
                  render={({field}) => (
                    <Checkbox
                      isSelected={field.value}
                      onValueChange={field.onChange}
                    >
                      Make this radio station public
                    </Checkbox>
                  )}
                />
              </div>

              <Divider className="my-2"/>

              {/* Moderator Voice Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Moderator Voice</h3>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="voice_id" className="text-sm font-medium">
                      Select Voice (Optional)
                    </label>
                    <Controller
                      name="voice_id"
                      control={control}
                      render={({field}) => (
                        <Select
                          aria-label={field.name}
                          id="voice_id"
                          placeholder="Select a moderator voice"
                          value={field.value}
                          onChange={field.onChange}
                          isLoading={moderatorsLoading}
                          className="max-w-full"
                        >
                          {
                            !moderators ? null : moderators.map((moderator) => (
                              <SelectItem key={moderator.id} aria-label={moderator.name}>
                                {moderator.name}
                              </SelectItem>
                            ))
                          }
                        </Select>
                      )}
                    />
                    <div className="text-xs text-gray-500">
                      A moderator voice will introduce songs and add personality to your radio station.
                    </div>
                  </div>

                  {selectedVoiceId && (
                    <div className="flex flex-col gap-2">
                      <label htmlFor="voice_description" className="text-sm font-medium">
                        Voice Personality (Optional)
                      </label>
                      <Textarea
                        id="voice_description"
                        placeholder="Describe the personality of your moderator (e.g., 'Energetic and enthusiastic DJ who loves rock music')"
                        {...register("voice_description")}
                      />
                      <div className="text-xs text-gray-500">
                        Customize how your moderator speaks by describing their personality.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Divider className="my-2"/>

              {/* Songs Section */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Add Songs</h3>

                  <Button
                    size="sm"
                    variant="flat"
                    color="secondary"
                    onPress={() => setBulkUrlsModalOpen(true)}
                  >
                    Bulk Add URLs
                  </Button>
                </div>

                <div className="text-xs text-gray-500 mb-4">
                  Add YouTube video URLs. Supported formats: youtube.com/watch?v=... or youtu.be/...
                </div>

                <div className="flex flex-col gap-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <Input
                        placeholder="YouTube URL (e.g., https://www.youtube.com/watch?v=...)"
                        {...register(`songs.${index}.url` as const, {
                          required: index === 0 ? "At least one YouTube URL is required" : false,
                          pattern: {
                            value: YOUTUBE_REGEX,
                            message: "Please enter a valid YouTube URL"
                          }
                        })}
                        color={errors.songs?.[index]?.url ? "danger" : "default"}
                        errorMessage={errors.songs?.[index]?.url?.message}
                        className="flex-1"
                      />

                      <Button
                        color="danger"
                        variant="flat"
                        isIconOnly
                        onPress={() => remove(index)}
                        isDisabled={index === 0 && fields.length === 1} // Prevent removing the last field
                      >
                        ✕
                      </Button>
                    </div>
                  ))}

                  <Button
                    color="primary"
                    variant="flat"
                    onPress={() => append({url: ''})}
                    className="w-full mt-2"
                  >
                    + Add Another Song
                  </Button>
                </div>
              </div>

              {(error || createRadioMutation.error) && (
                <div className="text-red-500 text-sm p-3 bg-red-50 rounded-lg border border-red-200">
                  {error || (createRadioMutation.error instanceof Error
                    ? createRadioMutation.error.message
                    : 'An error occurred while creating the radio station')}
                </div>
              )}

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  color="default"
                  variant="flat"
                  onPress={() => navigate('/')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  isLoading={createRadioMutation.isPending}
                  isDisabled={createRadioMutation.isPending}
                >
                  Create Radio Station
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>

      {/* Bulk URLs Modal */}
      <Modal
        isOpen={bulkUrlsModalOpen}
        onOpenChange={setBulkUrlsModalOpen}
        size="2xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add Multiple YouTube URLs
              </ModalHeader>
              <ModalBody>
                <p className="text-sm text-gray-600 mb-2">
                  Paste multiple YouTube URLs below (one per line). All current URLs will be replaced.
                </p>
                <Textarea
                  placeholder="https://www.youtube.com/watch?v=example1&#10;https://youtu.be/example2&#10;..."
                  value={bulkUrlsInput}
                  onChange={(e) => setBulkUrlsInput(e.target.value)}
                  rows={10}
                  variant="bordered"
                  classNames={{
                    innerWrapper: "font-mono text-sm"
                  }}
                />
                {bulkUrlsError && (
                  <div className="text-red-500 text-sm mt-2">{bulkUrlsError}</div>
                )}
                <div className="text-xs text-gray-500 mt-2">
                  <p>✓ Supported URL formats:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>youtube.com/watch?v=...</li>
                    <li>youtu.be/...</li>
                    <li>music.youtube.com/watch?v=...</li>
                  </ul>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={processBulkUrls}>
                  Add URLs
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

